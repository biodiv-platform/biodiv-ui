import { nanoid } from "nanoid";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";

import { axFinalizeLayerUpload, axTusUploadLayerFile } from "@/services/tusupload.service";

import { RASTER_FILE_TYPES } from "./data";

export enum MapFileType {
  raster = "RASTER",
  vector = "VECTOR"
}

export enum FileUploadStatus {
  Idle = "idle",
  Uploading = "uploading",
  Done = "done",
  Error = "error"
}

export interface FileUploadState {
  status: FileUploadStatus;
  percent: number;
}

export interface LayerUploadProps {
  nakshaEndpoint: string;
  bearerToken: string;
  callback?;
  children?;
  lang?;
}

interface LayerUploadContextProps extends LayerUploadProps {
  canContinue: boolean;
  setCanContinue: (boolean) => void;

  screen: number;
  setScreen: (number) => void;
  mapFileType: MapFileType;
  setMapFileType: (fileType: MapFileType) => void;

  rasterFiles;
  shapeFiles;
  updateMapFile: (fileType, file, meta?) => void;

  fileUploadState: Record<string, FileUploadState>;
  canSubmit: boolean;

  uploadStatus;
  uploadLayer: (payload) => void;
}

const LayerUploadContext = createContext<LayerUploadContextProps>({} as LayerUploadContextProps);

// Which file roles are mandatory before submit is allowed, per file type.
const REQUIRED_ROLES: Record<MapFileType, string[]> = {
  [MapFileType.vector]: ["shp", "dbf", "shx"],
  [MapFileType.raster]: ["tif"]
};

export const LayerUploadProvider = (props: LayerUploadProps) => {
  // One id per upload attempt — shared across every file so naksha-integrator
  // can land them together and correlate them at submit time. Regenerated
  // whenever the file-type tab is switched (old files are abandoned).
  const hashRef = useRef(nanoid());

  const [canContinue, setCanContinue] = useState(false);
  const [screen, setScreen] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null);
  const [mapFileType, setMapFileType] = useState<MapFileType>(MapFileType.vector);

  const [shapeFiles, setShapeFiles] = useImmer({
    dbf: { file: null, meta: {} },
    shp: { file: null, meta: {} },
    shx: { file: null, meta: {} }
  });

  const [rasterFiles, setRasterFiles] = useImmer({
    tif: { file: null, meta: {} },
    sld: { file: null, meta: {} }
  });

  const [fileUploadState, setFileUploadState] = useImmer<Record<string, FileUploadState>>({});

  useEffect(() => {
    if (shapeFiles.dbf.file && shapeFiles.shp.file && shapeFiles.shx.file) {
      setCanContinue(true);
    }

    if (rasterFiles.tif.file) {
      setCanContinue(true);
    }
  }, [shapeFiles, rasterFiles]);

  const changeMapFileType = (val) => {
    // Abandon any in-flight/completed uploads for the old tab and start fresh —
    // naksha-integrator will sweep the orphaned directory on its own schedule.
    hashRef.current = nanoid();
    setShapeFiles({
      dbf: { file: null, meta: {} },
      shp: { file: null, meta: {} },
      shx: { file: null, meta: {} }
    });
    setRasterFiles({
      tif: { file: null, meta: {} },
      sld: { file: null, meta: {} }
    });
    setFileUploadState({});
    setMapFileType(val);
  };

  // Kicks off the tus upload for one file the moment it's dropped. Runs fully
  // in parallel with the local shp/dbf parsing that populates the form below —
  // neither one waits on the other.
  const startFileUpload = (fileRole: string, file: File) => {
    setFileUploadState((draft) => {
      draft[fileRole] = { status: FileUploadStatus.Uploading, percent: 0 };
    });

    axTusUploadLayerFile(file, hashRef.current, fileRole, (percent) => {
      setFileUploadState((draft) => {
        if (draft[fileRole]) {
          draft[fileRole].percent = percent;
        }
      });
    })
      .then(() => {
        setFileUploadState((draft) => {
          draft[fileRole] = { status: FileUploadStatus.Done, percent: 100 };
        });
      })
      .catch((e) => {
        console.error(e);
        setFileUploadState((draft) => {
          draft[fileRole] = { status: FileUploadStatus.Error, percent: 0 };
        });
      });
  };

  const updateMapFile = (fileType, file, meta = {}) => {
    if (RASTER_FILE_TYPES.TIF.includes(fileType) || RASTER_FILE_TYPES.SLD.includes(fileType)) {
      setRasterFiles((_draft) => {
        _draft[fileType] = { file, meta };
      });
    } else {
      setShapeFiles((_draft) => {
        _draft[fileType] = { file, meta };
      });
    }
    if (file) {
      startFileUpload(fileType, file);
    }
  };

  // True once every mandatory file for the current tab has finished uploading.
  const canSubmit = REQUIRED_ROLES[mapFileType].every(
    (role) => fileUploadState[role]?.status === FileUploadStatus.Done
  );

  const uploadLayer = async (metadata) => {
    setScreen(2);
    try {
      const data = await axFinalizeLayerUpload(hashRef.current, metadata);
      props.callback(true, data);
      setUploadStatus(true);
    } catch (e) {
      console.error(e);
      props.callback(false);
      setUploadStatus(false);
    }
  };

  return (
    <LayerUploadContext.Provider
      value={{
        ...props,

        canContinue,
        setCanContinue,

        screen,
        setScreen,

        rasterFiles,
        shapeFiles,
        updateMapFile,

        fileUploadState,
        canSubmit,

        mapFileType,
        setMapFileType: changeMapFileType,

        uploadStatus,
        uploadLayer
      }}
    >
      {props.children}
    </LayerUploadContext.Provider>
  );
};

export default function useLayerUpload() {
  return useContext(LayerUploadContext);
}