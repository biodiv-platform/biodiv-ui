import { Button } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import DeleteIcon from "@icons/delete";
import { DEFAULT_FILTER } from "@static/observation-list";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const FILTERS_BLACKLIST = [...Object.keys(DEFAULT_FILTER), "lang", "userGroupList", "groupName"];

export default function ClearFilters() {
  const { filter } = useObservationFilter();
  const filterCount: any =
    filter && Object.keys(filter).filter((f) => !FILTERS_BLACKLIST.includes(f)).length > 0;
  const { t } = useTranslation();
  const message = t("filters:clear", { filterCount });
  const router = useLocalRouter();

  const clearFilters = () => router.push("/observation/list", true, {}, true);

  return filterCount ? (
    <Tooltip title={message} hasArrow={true}>
      <Button
        onClick={clearFilters}
        variant="link"
        className="fade"
        size="lg"
        colorPalette="red"
        aria-label={message}
        leftIcon={<DeleteIcon />}
      >
        {filterCount}
      </Button>
    </Tooltip>
  ) : null;
}
