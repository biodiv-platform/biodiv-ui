import SITE_CONFIG from "@configs/site-config";

export const TAXON_ROLES = [
  { label: "Observation Curator", value: "OBSERVATIONCURATOR" },
  { label: "Species Contributor", value: "SPECIESCONTRIBUTOR" },
  { label: "Taxonomy Contributor", value: "TAXONOMYCONTRIBUTOR" }
];

export const LIST_PAGINATION_LIMIT = 100;

export const DEFAULT_FILTER = {
  offset: 0,
  limit: LIST_PAGINATION_LIMIT,
  classificationId: SITE_CONFIG.TAXONOMY.ROOT,
  taxonId: SITE_CONFIG.TAXONOMY.ROOT
};

export const TAXON_STATUS_VALUES = {
  ACCEPTED: "ACCEPTED",
  SYNONYM: "SYNONYM"
};

export const TAXON_STATUS = [
  {
    label: "Accepted",
    value: TAXON_STATUS_VALUES.ACCEPTED
  },
  {
    label: "Synonym",
    value: TAXON_STATUS_VALUES.SYNONYM
  }
];

export const TAXON_POSITION = [
  {
    label: "Raw",
    value: "RAW"
  },
  {
    label: "Working",
    value: "WORKING"
  },
  {
    label: "Clean",
    value: "CLEAN"
  }
];
