import { Button } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpeciesList from "../use-species-list";

export const DEFAULT_SPECIES_FILTER = {
  sort: "species.dateCreated",
  offset: 0,
  max: 10
};


const FILTERS_BLACKLIST = [...Object.keys(DEFAULT_SPECIES_FILTER), "userGroupList"];

export default function ClearFilters() {
  const { filter } = useSpeciesList();
  const filterCount = Object.keys(filter.f).filter((f) => !FILTERS_BLACKLIST.includes(f)).length;
  const { t } = useTranslation();
  const message = t("filters:clear", { filterCount });
  const router = useLocalRouter();
  const clearFilters = () => router.push("/species/list", true, {}, true);

  return filterCount > 0 ? (
    <Tooltip title={message} hasArrow={true}>
      <Button
        onClick={clearFilters}
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
