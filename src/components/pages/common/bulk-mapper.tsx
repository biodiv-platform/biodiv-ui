import { Button, ButtonGroup } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuCircleCheck, LuRepeat, LuSettings } from "react-icons/lu";

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
          <Button variant="outline" colorPalette="blue" onClick={handleSelectAll}>
            <LuCircleCheck />
            {t("observation:select_all")}
          </Button>
        )}
        <Button
          variant="outline"
          colorPalette="red"
          onClick={() => handleBulkCheckbox("UnsSelectAll")}
        >
          <LuRepeat />
          {t("observation:unselect")}
        </Button>
        <Button variant="outline" colorPalette="green" onClick={openBulkMappingModal}>
          <LuSettings />
          {t("observation:actions")}
        </Button>
      </ButtonGroup>
    )
  );
}
