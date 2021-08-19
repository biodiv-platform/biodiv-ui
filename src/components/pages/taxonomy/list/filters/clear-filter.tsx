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
    <Tooltip title={message} hasArrow={true}>
      <Button
        onClick={resetFilter}
        variant="link"
        className="fade"
        size="lg"
        colorScheme="red"
        aria-label={message}
        leftIcon={<DeleteIcon />}
      >
        {filterCount}
      </Button>
    </Tooltip>
  ) : null;
}
