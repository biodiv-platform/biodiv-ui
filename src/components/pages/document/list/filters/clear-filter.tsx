import { Button } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "@hooks/use-translation";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import DeleteIcon from "@icons/delete";
import { DEFAULT_FILTER } from "@static/documnet-list";
import React from "react";

const FILTERS_BLACKLIST = [...Object.keys(DEFAULT_FILTER), "lang", "userGroupList", "groupName"];

export default function ClearFilters() {
  const { filter } = useDocumentFilter();
  const filterCount = Object.keys(filter).filter((f) => !FILTERS_BLACKLIST.includes(f)).length;
  const { t } = useTranslation();
  const message = t("FILTERS.CLEAR", { filterCount });
  const router = useLocalRouter();

  const clearFilters = () => router.push("/document/list", true, {}, true);

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
