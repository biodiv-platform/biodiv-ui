export const SPECIES_FILTER_KEY = {
  index: "esp",
  scientificName: {
    filterKey: "scientificName",
    searchKey: "taxonomyDefinition.defaultHierarchy.name"
  },
  commonName: {
    filterKey: "commonName",
    searchKey: "taxonomicNames.commonNames.name"
  }
};

export const DEFAULT_SPECIES_FILTER = {
  sort: "species.dateCreated",
  view: "grid",
  offset: 0,
  max: 10
};

export const sortByOptions = [
  {
    name: "common:list.sort_options.latest",
    key: "species.dateCreated"
  },
  {
    name: "common:list.sort_options.last_updated",
    key: "species.lastUpdated"
  }
];
