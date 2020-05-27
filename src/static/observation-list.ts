import { ObservationFilterProps } from "@interfaces/custom";

export const LIST_PAGINATION_LIMIT = 10;

export const DEFAULT_FILTER: ObservationFilterProps = {
  sort: "created_on",
  offset: 0,
  max: LIST_PAGINATION_LIMIT,
  view: "list"
};

export const viewTabs = [
  {
    name: "LIST.VIEW_TYPE.LIST",
    icon: "ibplist",
    key: "list"
  },
  {
    name: "LIST.VIEW_TYPE.GRID",
    icon: "ibpgrid",
    key: "list_minimal"
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
