export const observationFilterList = {
  core: [
    { name: "catalogNumber" },
    { name: "scientificname" },
    { name: "vernacularname" },
    { name: "taxonRank" },
    { name: "identificationVerificationStatus" },
    { name: "taxonomicStatus" },
    { name: "noOfIdentifications" },
    { name: "higherClassification" },
    { name: "eventDate" },
    { name: "dateAccuracy" },
    { name: "verbatimLocality" },
    { name: "geoprivacy" },
    { name: "decimalLatitude" },
    { name: "decimalLongitude" },
    { name: "locationScale" },
    { name: "flagCount" },
    { name: "flagReason" },
    { name: "recordedBy" },
    { name: "createdon" },
    { name: "associatedMedia" }
  ],
  taxonomic: [
    { name: "previousIdentifications" },
    { name: "previousVernacularNames" },
    { name: "speciesPageID" },
    { name: "higherClassificationID" }
  ],
  temporal: [{ name: "toDate" }, { name: "observedInMonth" }, { name: "lastRevised" }],
  spatial: [
    { name: "reverseGeocodedName" },
    { name: "state" },
    { name: "tahsil" },
    { name: "district" }
  ],
  misc: [
    { name: "noOfImages" },
    { name: "datasetName" },
    { name: "containsMedia" },
    { name: "uploadProtocol" },
    { name: "organismRemarks" },
    { name: "tags" },
    { name: "speciesGroup" }
  ]
};
