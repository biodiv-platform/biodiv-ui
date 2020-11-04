import SITE_CONFIG from "@configs/site-config.json";
import GridIcon from "@icons/grid";
import ListIcon from "@icons/list";
import React from "react";

export const LIST_PAGINATION_LIMIT = 10;

export const DEFAULT_FILTER = {
  sort: "document.createdOn",
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
  }
];

export const sortByOptions = [
  {
    name: "LIST.SORT_OPTIONS.LAST_UPDATED",
    key: "last_revised"
  },
  {
    name: "LIST.SORT_OPTIONS.LATEST",
    key: "created_on"
  }
];

export const actionTabs = [
  {
    name: "OBSERVATION.INFORMATION",
    active: true,
    icon: "ℹ️"
  },
  {
    name: "OBSERVATION.USERGROUPS",
    active: SITE_CONFIG.USERGROUP.ACTIVE,
    icon: "👥"
  },
  {
    name: "OBSERVATION.COMMENTS.TITLE",
    active: true,
    icon: "💬"
  }
];
