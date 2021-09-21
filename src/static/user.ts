import { LIST_PAGINATION_LIMIT } from "./documnet-list";

export const sortByOptions = [
  {
    name: "common:list.sort_options.last_logged_in",
    key: "user.lastLoginDate"
  },
  {
    name: "common:list.sort_options.latest",
    key: "user.dateCreated"
  }
];

export const DEFAULT_FILTER = {
  sort: "user.dateCreated",
  offset: 0,
  max: LIST_PAGINATION_LIMIT
};

export const USER_FILTER_KEY = {
  index: "eu",
  name: {
    filterKey: "name",
    searchKey: "user.name"
  },
  email: {
    filterKey: "email",
    searchKey: "user.email"
  },

  phoneNumber: {
    filterKey: "phoneNumber",
    searchKey: "user.mobileNumber"
  },

  userName: {
    filterKey: "userName",
    searchKey: "user.userName"
  }
};
