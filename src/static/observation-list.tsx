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
  view: "list"
};

export const viewTabs = [
  {
    name: "LIST.VIEW_TYPE.LIST",
    icon: <ListIcon />,
    key: "list"
  },
  {
    name: "LIST.VIEW_TYPE.GRID",
    icon: <GridIcon />,
    key: "list_minimal"
  },
  {
    name: "LIST.VIEW_TYPE.STATS",
    icon: <StatsIcon />,
    key: "stats"
  }
  /*
  {
    name: "LIST.VIEW_TYPE.MAP",
    icon: MdMap,
    key: "map"
  }
  */
];

export const sortByOptions = [
  {
    name: "LIST.SORT_OPTIONS.LAST_UPDATED",
    key: "last_revised"
  },
  {
    name: "LIST.SORT_OPTIONS.LATEST",
    key: "created_on"
  },
  {
    name: "LIST.SORT_OPTIONS.MOST_VIEWED",
    key: "visit_count"
  }
];

export const actionTabs = [
  {
    name: "OBSERVATION.INFORMATION",
    icon: "ℹ️"
  },
  {
    name: "OBSERVATION.ID.TITLE",
    icon: "🆔"
  },
  {
    name: "OBSERVATION.USERGROUPS",
    icon: "👥"
  },
  {
    name: "OBSERVATION.TRAITS",
    icon: "💎"
  },
  {
    name: "OBSERVATION.CUSTOM_FIELDS",
    icon: "🔶"
  },
  {
    name: "OBSERVATION.COMMENTS.TITLE",
    icon: "💬"
  }
];
