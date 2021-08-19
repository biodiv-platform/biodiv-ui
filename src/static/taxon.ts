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
    value: TAXON_STATUS_VALUES.ACCEPTED,
    valueIcon: "/next-assets/taxon-status/accepted.svg"
  },
  {
    label: "Synonym",
    value: TAXON_STATUS_VALUES.SYNONYM,
    valueIcon: "/next-assets/taxon-status/synonym.svg"
  }
];

export const TAXON_POSITION = [
  {
    label: "Raw",
    value: "RAW",
    color: "var(--chakra-colors-gray-300)"
  },
  {
    label: "Working",
    value: "WORKING",
    color: "var(--chakra-colors-yellow-300)"
  },
  {
    label: "Clean",
    value: "CLEAN",
    color: "var(--chakra-colors-green-300)"
  }
];
