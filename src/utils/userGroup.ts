import SITE_CONFIG from "@configs/site-config";
import { UserGroupIbp } from "@interfaces/observation";
import { DEFAULT_GROUP } from "@static/constants";
import { stringify } from "@utils/query-string";

import { getGroupImage } from "./media";

export const transformUserGroupList = (list: UserGroupIbp[]): UserGroupIbp[] => {
  return list.map((group: UserGroupIbp) => ({
    ...group,
    webAddress: group.webAddress?.startsWith("/")
      ? SITE_CONFIG.SITE.URL + group.webAddress
      : group.webAddress,
    icon: getGroupImage(group.icon)
  }));
};

export const findCurrentUserGroup = (
  groups: UserGroupIbp[],
  currentURL: string,
  lang?: string
): UserGroupIbp => {
  const defaultGroup = {
    ...DEFAULT_GROUP,
    name: SITE_CONFIG.SITE.TITLE?.[lang || SITE_CONFIG.LANG.DEFAULT] || DEFAULT_GROUP.name
  };

  return (
    (currentURL &&
      groups.find(
        (group: UserGroupIbp) => group.webAddress && currentURL.startsWith(group.webAddress)
      )) ||
    defaultGroup
  );
};

export const getManifestURL = (group: UserGroupIbp) => {
  const { name, icon } = group;
  return `/api/manifest.json?${stringify({ name, icon })}`;
};

export const reorderRemovedGallerySetup = (data, index) => {
  const list = data.sort((a, b) => a.displayOrder - b.displayOrder);
  const removedDisplayOrder = Number(data[index][0].split("|")[1]);

  const serializeDisplayOrder = () => {
    return list.reduce((acc, item) => {
      if (Number(item[0].split("|")[1]) !== removedDisplayOrder) {
        if (Number(item[0].split("|")[1]) > removedDisplayOrder) {
          item[0] = `${Number(item[0].split("|")[0])}|${Number(item[0].split("|")[1]) - 1}`;
        }
        acc.push(item);
      }
      return acc;
    }, []);
  };
  const response = list.length <= 1 ? list : serializeDisplayOrder();

  return {
    response,
    payload: response.map((item) => ({ galleryId: Number(item[0].split("|")[0]), displayOrder: Number(item[0].split("|")[1]) }))
  };
};
