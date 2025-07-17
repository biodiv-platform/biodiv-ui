import { formatDateFromUTC } from "@utils/date";

export const formatGroupRules = (rules, traits) => {
  const groupRules: any[] = [];
  const {
    hasUserRule,
    taxonomicRuleList,
    spartialRuleList,
    observedOnDateRule,
    createdOnDateRuleList,
    traitRuleList
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
  //populate trait rules array
  traitRuleList?.forEach((item) => {
    const trait = traits.filter((trait) => trait.traits.traitId === item.traitId)[0];
    groupRules.push({
      id: item.id,
      name: "traitRule",
      value: `${trait.traits.name} : ${
        trait.values.filter((v) => v.traitValueId === item.value)[0].value
      }`
    });
  });

  return groupRules;
};
