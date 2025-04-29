import { RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function BulkMapperHeader({ bulkIds, handleBulkCheckbox, openBulkMappingModal }) {
  const { t } = useTranslation();

  return (
    bulkIds &&
    bulkIds?.length > 0 && (
      <ButtonGroup size="sm" variant="outline">
        <Button
          variant="outline"
          colorScheme="red"
          leftIcon={<RepeatIcon />}
          onClick={() => handleBulkCheckbox("UnsSelectAll")}
        >
          {t("user:unselect_all")}
        </Button>
        <Button
          variant="outline"
          colorScheme="green"
          leftIcon={<SettingsIcon />}
          onClick={openBulkMappingModal}
        >
          {t("user:actions")}
        </Button>
      </ButtonGroup>
    )
  );
}
