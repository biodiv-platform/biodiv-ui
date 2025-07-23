import SITE_CONFIG from "@configs/site-config";
import React from "react";
import { LuList } from "react-icons/lu";

export const LIST_PAGINATION_LIMIT = 12;

export const DEFAULT_FILTER = {
  sort: "document.createdOn",
  offset: 0,
  max: LIST_PAGINATION_LIMIT,
  view: "list"
};

export const viewTabs = [
  {
    name: "common:list.view_type.list",
    icon: <LuList />,
    key: "list"
  }
];

export const sortByOptions = [
  {
    name: "common:list.sort_options.last_updated",
    key: "document.lastRevised"
  },
  {
    name: "common:list.sort_options.latest",
    key: "document.createdOn"
  }
];

export const actionTabs = [
  {
    name: "common:information",
    active: true,
    icon: "ℹ️"
  },
  {
    name: "common:usergroups",
    active: SITE_CONFIG.USERGROUP.ACTIVE,
    icon: "👥"
  },
  {
    name: "document:tags.title",
    active: true,
    icon: "🏷"
  },
  {
    name: "form:comments.title",
    active: true,
    icon: "💬"
  }
];
