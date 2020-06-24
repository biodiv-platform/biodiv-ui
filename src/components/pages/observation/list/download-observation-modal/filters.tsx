export const OBSERVATION_FILTERS = [
  {
    name: "core",
    label: "General",
    options: [
      { value: "catalogNumber", label: "Catalog Number" },
      { value: "scientificname", label: "Scientific Name" },
      { value: "vernacularname", label: "Vernacular Name" },
      { value: "taxonRank", label: "Taxon Rank" },
      { value: "identificationVerificationStatus", label: "Identification Verification Status" },
      { value: "taxonomicStatus", label: "Taxonomic Status" },
      { value: "noOfIdentifications", label: "No of Identifications" },
      { value: "higherClassification", label: "Higher Classification" },
      { value: "eventDate", label: "Event Date" },
      { value: "dateAccuracy", label: "Date Accuracy" },
      { value: "verbatimLocality", label: "Verbatim Locality" },
      { value: "geoprivacy", label: "Geoprivacy" },
      { value: "decimalLatitude", label: "Decimal Latitude" },
      { value: "decimalLongitude", label: "Decimal Longitude" },
      { value: "locationScale", label: "Location Scale" },
      { value: "flagCount", label: "Flag Count" },
      { value: "flagReason", label: "Flag Reason" },
      { value: "recordedBy", label: "Recorded By" },
      { value: "createdon", label: "Created on" },
      { value: "associatedMedia", label: "Associated Media" }
    ],
    disabled: true
  },
  {
    name: "taxonomic",
    label: "Taxonomic",
    options: [
      { value: "previousIdentifications", label: "Previous Identifications" },
      { value: "previousVernacularNames", label: "Previous Vernacular Names" },
      { value: "speciesPageId", label: "Species Page ID" },
      { value: "higherClassificationId", label: "Higher Classification ID" }
    ]
  },
  {
    name: "temporal",
    label: "Temporal",
    options: [
      { value: "toDate", label: "To Date" },
      { value: "observedInMonth", label: "Observed in Month" },
      { value: "lastRevised", label: "Last Revised" }
    ]
  },
  {
    name: "spatial",
    label: "Spatial",
    options: [
      { value: "reverseGeocodedName", label: "Reverse Geocoded Name" },
      { value: "state", label: "State" },
      { value: "tahsil", label: "Tahsil" },
      { value: "district", label: "District" }
    ]
  },
  {
    name: "misc",
    label: "Miscellaneous",
    options: [
      { value: "noOfImages", label: "No of Images" },
      { value: "datasetName", label: "Dataset Name" },
      { value: "containsMedia", label: "Contains Media" },
      { value: "uploadProtocol", label: "Upload Protocol" },
      { value: "organismRemarks", label: "Organism Remarks" },
      { value: "tags", label: "Tags" },
      { value: "speciesGroup", label: "Species Group" }
    ]
  }
];
