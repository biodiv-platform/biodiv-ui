import SITE_CONFIG from "@configs/site-config";
import { UserGroupIbp } from "@interfaces/observation";
import { DEFAULT_GROUP } from "@static/constants";
import { formatDateFromUTC } from "@utils/date";
import { stringify } from "querystring";

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

export const formatGroupRules = (rules) => {
  const groupRules: any[] = [];
  const {
    hasUserRule,
    taxonomicRuleList,
    spartialRuleList,
    observedOnDateRule,
    createdOnDateRuleList
  } = rules;
  //populate user rules
  groupRules.push({ name: "userRule", value: hasUserRule ? "true" : "false" });
  //populate spatial rules array
  spartialRuleList?.forEach((item) =>
    groupRules.push({ id: item.id, name: "spatialRule", value: item.spatialData })
  );

  //populate taxon rules array
  taxonomicRuleList?.forEach((item) => {
    groupRules.push({ id: item.id, name: "taxonomicRule", value: item.taxonomyId });
  });
  //observed on date
  observedOnDateRule?.forEach((item) => {
    groupRules.push({
      id: item.id,
      name: "observedOnDateRule",
      value: `${formatDateFromUTC(item.fromDate)} to ${formatDateFromUTC(item.toDate)}`
    });
  });
  //created on date
  createdOnDateRuleList?.forEach((item) => {
    groupRules.push({
      id: item.id,
      name: "createdOnDateRule",
      value: `${formatDateFromUTC(item.fromDate)} to ${formatDateFromUTC(item.toDate)}`
    });
  });

  return groupRules;
};

export const reorderRemovedGallerySetup = (data, index) => {
  const list = data.sort((a, b) => a.displayOrder - b.displayOrder);
  const removedDisplayOrder = data[index].displayOrder;

  const serializeDisplayOrder = () => {
    return list.reduce((acc, item) => {
      if (item.displayOrder !== removedDisplayOrder) {
        if (item.displayOrder > removedDisplayOrder) {
          item.displayOrder = item.displayOrder - 1;
        }
        acc.push(item);
      }
      return acc;
    }, []);
  };
  const response = list.length <= 1 ? list : serializeDisplayOrder();

  return {
    response,
    payload: response.map(({ id, displayOrder }) => ({ galleryId: id, displayOrder }))
  };
};
