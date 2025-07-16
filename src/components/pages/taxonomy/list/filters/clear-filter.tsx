import { Button } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useTaxonFilter from "../use-taxon";

export function ClearFilters() {
  const { resetFilter, filter } = useTaxonFilter();
  const { t } = useTranslation();

  const filterCount = Object.keys(filter).length;
  const message = t("filters:clear", { filterCount });

  return filterCount > 0 ? (
    <Tooltip title={message} showArrow={true}>
      <Button
        onClick={resetFilter}
        variant="plain"
        className="fade"
        size="lg"
        colorPalette="red"
        aria-label={message}
      >
        <DeleteIcon />
        {filterCount}
      </Button>
    </Tooltip>
  ) : null;
}
