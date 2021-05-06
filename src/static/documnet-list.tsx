import SITE_CONFIG from "@configs/site-config.json";
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
  }
];

export const sortByOptions = [
  {
    name: "LIST.SORT_OPTIONS.LAST_UPDATED",
    key: "document.lastRevised"
  },
  {
    name: "LIST.SORT_OPTIONS.LATEST",
    key: "document.createdOn"
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
    name: "DOCUMENT.TAGS.TITLE",
    active: true,
    icon: "🔖"
  },
  {
    name: "OBSERVATION.COMMENTS.TITLE",
    active: true,
    icon: "💬"
  }
];
