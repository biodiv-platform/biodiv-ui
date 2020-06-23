import { UserGroupIbp } from "@interfaces/observation";
import { DEFAULT_GROUP } from "@static/constants";
import { stringify } from "querystring";

import { getGroupImage } from "./media";

export const transformUserGroupList = (list: UserGroupIbp[]): UserGroupIbp[] => {
  return list.map((group: UserGroupIbp) => ({
    ...group,
    webAddress: group.webAddress.startsWith("/")
      ? process.env.NEXT_PUBLIC_SITE_URL + group.webAddress
      : group.webAddress,
    icon: getGroupImage(group.icon)
  }));
};

export const findCurrentUserGroup = (groups: UserGroupIbp[], currentURL: string): UserGroupIbp => {
  return (
    (currentURL && groups.find((group: UserGroupIbp) => currentURL.startsWith(group.webAddress))) ||
    DEFAULT_GROUP
  );
};

export const getManifestURL = (group: UserGroupIbp) => {
  const { name, icon } = group;
  return `/api/manifest.json?${stringify({ name, icon })}`;
};
