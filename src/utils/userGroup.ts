import SITE_CONFIG from "@configs/site-config.json";
import { UserGroupIbp } from "@interfaces/observation";
import { DEFAULT_GROUP } from "@static/constants";
import { formatDateFromUTC } from "@utils/date";
import { stringify } from "querystring";

import { getGroupImage } from "./media";

export const transformUserGroupList = (list: UserGroupIbp[]): UserGroupIbp[] => {
  return list.map((group: UserGroupIbp) => ({
    ...group,
    webAddress: group.webAddress.startsWith("/")
      ? SITE_CONFIG.SITE.URL + group.webAddress
      : group.webAddress,
    icon: getGroupImage(group.icon)
  }));
};

export const findCurrentUserGroup = (groups: UserGroupIbp[], currentURL: string): UserGroupIbp => {
  return (
    (currentURL &&
      groups.find((group: UserGroupIbp) => currentURL.startsWith(`${group.webAddress}/`))) ||
    DEFAULT_GROUP
  );
};

export const getManifestURL = (group: UserGroupIbp) => {
  const { name, icon } = group;
  return `/api/manifest.json?${stringify({ name, icon })}`;
};

export const formatGroupRules = (rules) => {
  const groupRules = [];
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

  //populate date rules array
  observedOnDateRule?.forEach((item) => {
    groupRules.push({
      id: item.id,
      name: "observedOnDateRule",
      value: `${formatDateFromUTC(item.fromDate)} to ${formatDateFromUTC(item.toDate)}`
    });
    createdOnDateRuleList?.forEach((item) => {
      groupRules.push({
        id: item.id,
        name: "createdOnDateRule",
        value: `${formatDateFromUTC(item.fromDate)} to ${formatDateFromUTC(item.toDate)}`
      });
    });
  });

  return groupRules;
};
