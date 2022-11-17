import { formatDate } from "@utils/date";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

import { RASTER_FILE_TYPES } from "./data";

export enum MapFileType {
  raster = "RASTER",
  vector = "VECTOR"
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
  handleOnSubmitMetaForm;
  updateMapFile: (fileType, file, meta?) => void;

  uploadStatus;
  uploadLayer: (payload) => void;
}

const LayerUploadContext = createContext<LayerUploadContextProps>({} as LayerUploadContextProps);

export const LayerUploadProvider = (props: LayerUploadProps) => {
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

  useEffect(() => {
    if (shapeFiles.dbf.file && shapeFiles.dbf.file && shapeFiles.shx.file) {
      setCanContinue(true);
    }

    if (rasterFiles.tif.file && rasterFiles.sld.file) {
      setCanContinue(true);
    }
  }, [shapeFiles, rasterFiles]);

  const changeMapFileType = (val) => {
    setShapeFiles({
      dbf: { file: null, meta: {} },
      shp: { file: null, meta: {} },
      shx: { file: null, meta: {} }
    });
    setRasterFiles({
      tif: { file: null, meta: {} },
      sld: { file: null, meta: {} }
    });
    setMapFileType(val);
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
  };

  const handleOnSubmitMetaForm = (values) => {
    uploadLayer({
      ...values,
      createdDate: formatDate(values.createdDate),
      layerFileDescription: {
        fileType: values.layerType === MapFileType.vector ? "shp" : "tif",
        encoding: "UTF-8"
      },
      editAccess: "ALL",
      summaryColumns: values.summaryColumns.toString().toLowerCase()
    });
  };

  const uploadLayer = async (metadata) => {
    setScreen(2);
    try {
      const formData: any = new FormData();
      const mapFiles =
      mapFileType === MapFileType.raster ? rasterFiles : shapeFiles;

      Object.keys(mapFiles).map((type) => formData.append(type, mapFiles?.[type]?.file));

      formData.append(
        "metadata",
        new File([JSON.stringify(metadata)], "metadata.json", {
          type: "application/json",
          lastModified: new Date().getTime()
        })
      );

      const response = await fetch(props.nakshaEndpoint, {
        method: "POST",
        body: formData,
        headers: { Authorization: props.bearerToken }
      });
      const data = await response.json();

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

        handleOnSubmitMetaForm,

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
