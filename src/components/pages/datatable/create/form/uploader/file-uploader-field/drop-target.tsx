import { TimeIcon } from "@chakra-ui/icons";
import { Button, Heading, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import useTranslation from "@hooks/use-translation";
import { axUploadObservationResource } from "@services/files.service";
import { getAssetObject } from "@utils/image";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropTargetBox = styled.div`
  border: 2px dashed var(--gray-300);
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
    border-color: var(--blue-500);
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
  simpleUpload?: boolean;
}

export default function DropTarget({
  setValue,
  simpleUpload,
  setFieldMapping
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
      notification(t("DATATABLE.NOTIFICATIONS.SHEET_UPLOAD_SUCCESS"), NotificationType.Success);
    } else {
      notification(t("DATATABLE.NOTIFICATIONS.SHEET_UPLOAD_ERROR"), NotificationType.Error);
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
          <span>{t("OBSERVATION.UPLOADER.PROCESSING")}</span>
        </div>
      ) : simpleUpload ? (
        <Button colorScheme="blue" variant="outline" children={t("OBSERVATION.UPLOADER.UPLOAD")} />
      ) : (
        <div className="fade">
          <Heading size="md">{t("OBSERVATION.UPLOADER.LABEL")}</Heading>
          <Text my={2} color="gray.500">
            {t("OR")}
          </Text>
          <Button
            colorScheme="blue"
            variant="outline"
            children={t("OBSERVATION.UPLOADER.BROWSE")}
          />
        </div>
      )}
    </DropTargetBox>
  );
}
