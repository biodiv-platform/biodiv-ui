import { TimeIcon } from "@chakra-ui/icons";
import { Button, Heading, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { axUploadObservationResource } from "@services/files.service";
import { getAssetObject } from "@utils/image";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropTargetBox = styled.div`
  border: 2px dashed var(--chakra-colors-gray-300);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > div {
    text-align: center;
  }
  &[data-dropping="true"] {
    border-color: var(--chakra-colors-blue-500);
  }
  &[data-has-resources="false"] {
    grid-column: 1/6;
  }

  svg {
    display: block;
    font-size: 2.5rem;
    margin: 0 auto;
    margin-bottom: 0.5rem;
  }
`;

const accept = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel"
];
interface userGroupDropTarget {
  setValue;
  setFieldMapping;
  setShowMapping;
  simpleUpload?: boolean;
}

export default function DropTarget({
  setValue,
  simpleUpload,
  setFieldMapping,
  setShowMapping
}: userGroupDropTarget) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const handleOnDrop = async ([file]) => {
    setIsProcessing(true);
    if (!file) {
      return;
    }

    const { success, data } = await axUploadObservationResource(getAssetObject(file), "datasets");
    if (success) {
      setFieldMapping(data.excelJson);
      setValue(data.path);
      setShowMapping(true);
      notification(t("datatable:notifications.sheet_upload_success"), NotificationType.Success);
    } else {
      notification(t("datatable:notifications.sheet_upload_error"), NotificationType.Error);
    }

    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop: handleOnDrop
  });

  return (
    <DropTargetBox
      style={{ minHeight: simpleUpload ? "6rem" : "13rem" }}
      {...getRootProps()}
      data-dropping={isDragActive}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="fade">
          <TimeIcon />
          <span>{t("form:uploader.processing")}</span>
        </div>
      ) : simpleUpload ? (
        <Button colorScheme="blue" variant="outline" children={t("form:uploader.upload")} />
      ) : (
        <div className="fade">
          <Heading size="md">{t("form:uploader.label")}</Heading>
          <Text my={2} color="gray.500">
            {t("common:or")}
          </Text>
          <Button colorScheme="blue" variant="outline" children={t("form:uploader.browse")} />
        </div>
      )}
    </DropTargetBox>
  );
}
