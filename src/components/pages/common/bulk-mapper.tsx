import { CheckCircleIcon, RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function BulkMapperHeader({
  bulkIds,
  selectAll,
  handleSelectAll,
  handleBulkCheckbox,
  openBulkMappingModal
}) {
  const { t } = useTranslation();

  return (
    bulkIds &&
    bulkIds?.length > 0 && (
      <ButtonGroup size="sm" variant="outline">
        {!selectAll && (
          <Button
            variant="outline"
            colorScheme="blue"
            leftIcon={<CheckCircleIcon />}
            onClick={handleSelectAll}
          >
            {t("observation:selectAll")}
          </Button>
        )}
        <Button
          variant="outline"
          colorScheme="red"
          leftIcon={<RepeatIcon />}
          onClick={() => handleBulkCheckbox("UnsSelectAll")}
        >
          {t("observation:unselect")}
        </Button>
        <Button
          variant="outline"
          colorScheme="green"
          leftIcon={<SettingsIcon />}
          onClick={openBulkMappingModal}
        >
          {t("observation:actions")}
        </Button>
      </ButtonGroup>
    )
  );
}
