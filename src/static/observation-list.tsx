import SITE_CONFIG from "@configs/site-config";
import GridIcon from "@icons/grid";
import ListIcon from "@icons/list";
import StatsIcon from "@icons/stats";
import { ObservationFilterProps } from "@interfaces/custom";
import React from "react";

export const LIST_PAGINATION_LIMIT = 8;

export const DEFAULT_FILTER: ObservationFilterProps = {
  sort: "created_on",
  offset: 0,
  max: LIST_PAGINATION_LIMIT,
  view: "list",
  mediaFilter: "no_of_images,no_of_videos,no_of_audio"
};

export const OBSERVATION_FILTER_KEY = {
  index: "eo",
  dataSetName: {
    filterKey: "dataSetName",
    searchKey: "dataset_title"
  },
  dataTableName: {
    filterKey: "dataTableName",
    searchKey: "data_table_title"
  }
};

export const viewTabs = [
  {
    name: "common:list.view_type.list",
    icon: <ListIcon size={"sm"} />,
    key: "list"
  },
  {
    name: "common:list.view_type.grid",
    icon: <GridIcon size={"sm"} />,
    key: "list_minimal"
  },
  {
    name: "common:list.view_type.stats",
    icon: <StatsIcon size={"sm"} />,
    key: "stats"
  }
];

export const sortByOptions = [
  {
    name: "common:list.sort_options.last_updated",
    key: "last_revised"
  },
  {
    name: "common:list.sort_options.latest",
    key: "created_on"
  },
  {
    name: "common:list.sort_options.most_viewed",
    key: "visit_count"
  }
];

export const bulkActionTabs = [
  {
    name: "common:usergroups",
    icon: "👥",
    active: SITE_CONFIG.USERGROUP.ACTIVE
  },
  {
    name: "form:species_groups",
    icon:"👥"
  },
  {
    name: "observation:id.title",
    icon: "🆔"
  },
  {
    name: "observation:traits",
    icon: "💎"
  },
  {
    name: "filters:data_quality.validation.title",
    icon: "🆔"
  }
];

export const actionTabs = [
  {
    name: "common:information",
    icon: "ℹ️"
  },
  {
    name: "observation:id.title",
    icon: "🆔"
  },
  {
    name: "common:usergroups",
    icon: "👥",
    active: SITE_CONFIG.USERGROUP.ACTIVE
  },
  {
    name: "observation:traits",
    icon: "💎"
  },
  {
    name: "observation:custom_fields",
    icon: "🔶"
  },
  {
    name: "form:comments.title",
    icon: "💬"
  }
];
