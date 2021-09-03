import { IconButton, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import DeleteIcon from "@icons/delete";
import PDFIcon from "@icons/pdf";
import { formatTimeStampFromUTC } from "@utils/date";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

const DocumentList = styled.div`
  display: flex;
  border-radius: 0.25rem;
  background: white;
  border: 1px solid var(--chakra-colors-gray-300);
  cursor: pointer;

  .icon,
  .content,
  .action {
    padding: 0.25rem;
    flex-shrink: 0;
    min-width: 3rem;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon,
  .action {
    font-size: 1.2rem;
  }

  .content {
    padding-left: 0;
    flex-shrink: initial;
    flex-grow: 1;
    border-right: 1px solid var(--chakra-colors-gray-300);
  }

  .elipsis {
    height: 1.3rem;
    overflow: hidden;
    word-break: break-all;
  }
`;

interface FilePreviewProps {
  fileName;
  date?;
  onSelect?;
  onDelete;
}

export default function FilePreview({ fileName, date, onSelect, onDelete }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleOnDelete = async () => {
    setIsLoading(true);
    await onDelete();
    setIsLoading(false);
  };

  return (
    <DocumentList tabIndex={0} title={fileName} className="fade">
      <div className="icon" onClick={onSelect}>
        <PDFIcon color="red.500" />
      </div>
      <div className="content" onClick={onSelect}>
        <div className="elipsis">{fileName}</div>
        <Text as="small" color="gray.500">
          {formatTimeStampFromUTC(date)}
        </Text>
      </div>
      <IconButton
        variant="link"
        colorScheme="red"
        icon={<DeleteIcon />}
        className="action"
        isLoading={isLoading}
        aria-label={t("common:delete")}
        title={t("common:delete")}
        onClick={handleOnDelete}
      />
    </DocumentList>
  );
}
