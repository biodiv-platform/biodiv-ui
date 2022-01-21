export const SPECIES_FILTER_KEY = {
  index: "esp",
  scientificName: {
    filterKey: "scientificName",
    searchKey: "taxonomyDefinition.defaultHierarchy.name"
  },
  commonName: {
    filterKey: "commonName",
    searchKey: "taxonomicNames.commonNames.name"
  },
  attributes: {
    filterKey: "attributes",
    searchKey: "fieldData.attributions"
  },
  reference: {
    filterKey: "reference",
    searchKey: "fieldData.references.title"
  }
};

export const DEFAULT_SPECIES_FILTER = {
  sort: "species.lastUpdated",
  view: "grid",
  offset: 0,
  max: 16
};

export const sortByOptions = [
  {
    name: "common:list.sort_options.last_updated",
    key: "species.lastUpdated"
  },
  {
    name: "common:list.sort_options.latest",
    key: "species.dateCreated"
  }
];
