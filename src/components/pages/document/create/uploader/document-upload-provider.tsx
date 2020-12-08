import { ResourceDocument } from "@interfaces/custom";
import { MyUpload } from "@interfaces/files";
import {
  axListMyUploads,
  axRemoveMyUploads,
  axUploadDocumentResource
} from "@services/files.service";
import { RESOURCE_TYPE } from "@static/constants";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ManageDocumentContextProps {
  children?;
  initialDocument?: ResourceDocument;
  selectedDocument?: Partial<ResourceDocument>;
  documentList?: MyUpload[];
  addDocument?;
  addExternalDocument?;
  selectMyUploadsDocument?;
  deleteMyUploadsDocument?;
  clearSelectedDocument?;
}

const ManageDocumentContext = createContext<ManageDocumentContextProps>(
  {} as ManageDocumentContextProps
);

export const ManageDocumentContextProvider = (props: ManageDocumentContextProps) => {
  const [selectedDocument, setSelectedDocument] = useState<Partial<ResourceDocument> | undefined>(
    props.initialDocument
  );
  const [documentList, setDocumentList] = useState<MyUpload[]>([]);

  const listDocuments = async () => {
    const { success, data } = await axListMyUploads(RESOURCE_TYPE.DOCUMENT);
    if (success) {
      setDocumentList(data);
    }
  };

  const addDocument = async (file) => {
    const resource = await axUploadDocumentResource(file);
    setSelectedDocument({
      resourceURL: resource.path,
      size: resource.fileSize,
      timestamp: Number(resource.dateUploaded)
    });
    await listDocuments();
  };

  const clearSelectedDocument = () => setSelectedDocument(undefined);

  const addExternalDocument = (resourceURL) => {
    setSelectedDocument({
      resourceURL,
      size: "0",
      timestamp: new Date().getTime()
    });
  };

  const selectMyUploadsDocument = (document: MyUpload) => {
    setSelectedDocument({
      resourceURL: document.path,
      size: document.fileSize,
      timestamp: Number(document.dateUploaded)
    });
  };

  const deleteMyUploadsDocument = async (document) => {
    const { success } = await axRemoveMyUploads(document);
    if (success) {
      await listDocuments();
    }
  };

  useEffect(() => {
    listDocuments();
  }, []);

  return (
    <ManageDocumentContext.Provider
      value={{
        selectedDocument,
        documentList,
        addDocument,
        addExternalDocument,
        selectMyUploadsDocument,
        deleteMyUploadsDocument,
        clearSelectedDocument
      }}
    >
      {props.children}
    </ManageDocumentContext.Provider>
  );
};

export default function useManageDocument() {
  return useContext(ManageDocumentContext);
}
