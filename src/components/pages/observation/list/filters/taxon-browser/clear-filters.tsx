import { Button } from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@hooks/useObservationFilter";
import { compiledMessage } from "@utils/basic";
import React from "react";
import { DEFAULT_FILTER } from "@static/observation-list";

const FILTERS_BLACKLIST = [...Object.keys(DEFAULT_FILTER), "lang", "userGroupList", "groupName"];

export default function ClearFilters() {
  const { filter } = useObservationFilter();
  const filterCount = Object.keys(filter).filter((f) => !FILTERS_BLACKLIST.includes(f)).length;
  const { t } = useTranslation();
  const message = compiledMessage(t("FILTERS.CLEAR"), { filterCount });
  const router = useLocalRouter();

  const clearFilters = () => router.push("/observation/list", true, {}, true);

  return filterCount > 0 ? (
    <Tooltip title={message} hasArrow={true}>
      <Button
        onClick={clearFilters}
        variant="link"
        className="fade"
        size="lg"
        variantColor="red"
        aria-label={message}
        leftIcon="delete"
      >
        {filterCount}
      </Button>
    </Tooltip>
  ) : null;
}
