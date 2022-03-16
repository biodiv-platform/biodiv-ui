import React, { createContext, useContext, useEffect, useState } from "react";
import { useImmer } from "use-immer";

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

  shapeFiles;
  updateShapeFile: (fileType, file, meta?) => void;

  uploadStatus;
  uploadLayer: (payload) => void;
}

const LayerUploadContext = createContext<LayerUploadContextProps>({} as LayerUploadContextProps);

export const LayerUploadProvider = (props: LayerUploadProps) => {
  const [canContinue, setCanContinue] = useState(false);
  const [screen, setScreen] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<boolean | null>(null);

  const [shapeFiles, setShapeFiles] = useImmer({
    dbf: { file: null, meta: {} },
    shp: { file: null, meta: {} },
    shx: { file: null, meta: {} }
  });

  useEffect(() => {
    if (shapeFiles.dbf.file && shapeFiles.dbf.file && shapeFiles.shx.file) {
      setCanContinue(true);
    }
  }, [shapeFiles]);

  const updateShapeFile = (fileType, file, meta = {}) => {
    setShapeFiles((_draft) => {
      _draft[fileType] = { file, meta };
    });
  };

  const uploadLayer = async (metadata) => {
    setScreen(2);
    try {
      const formData: any = new FormData();

      Object.keys(shapeFiles).map((type) => formData.append(type, shapeFiles?.[type]?.file));

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

        shapeFiles,
        updateShapeFile,

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
