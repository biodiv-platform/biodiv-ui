import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import EditIcon from "@icons/edit";
import { axUpdateCoverageGroup } from "@services/document.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import CoverageEdit from "./coverage-edit";
import { CoverageShow } from "./coverage-show";

export default function CoveragePanel({
  icon,
  title,
  initialValue,
  items,
  type,
  documentId,
  endpointType
}) {
  const { t } = useTranslation();
  const { open, onToggle, onClose } = useDisclosure();
  const [coverageValue, setCoverageValue] = useState(initialValue);

  const onSave = async (newCoverageValue) => {
    const { success } = await axUpdateCoverageGroup(endpointType, documentId, newCoverageValue);
    if (success) {
      setCoverageValue(newCoverageValue);
      onClose();
      notification(t("document:update_success"), NotificationType.Success);
    } else {
      notification(t("document:update_error"));
    }
  };

  return (
    <Box mb={4} className="white-box">
      <BoxHeading styles={{ justifyContent: "space-between" }}>
        <span>
          {icon} {title}
        </span>
        <IconButton onClick={onToggle} aria-label="Edit" variant={"plain"}>
          <EditIcon />
        </IconButton>
      </BoxHeading>
      {open ? (
        <CoverageEdit
          value={coverageValue}
          onChange={onSave}
          items={items}
          type={type}
          onClose={onClose}
        />
      ) : (
        <CoverageShow value={coverageValue} items={items} type={type} />
      )}
    </Box>
  );
}
