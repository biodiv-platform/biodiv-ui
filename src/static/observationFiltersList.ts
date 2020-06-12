export const observationFilterList = {
    core: [
        {name:"catalogNumber"},
        {name:"scientificname"},
        {name:"vernacularname"},
        {name:"taxonRank"},
        {name:"identificationVerificationStatus"},
        {name:"taxonomicStatus"},
        {name:"NoOfIdentifications"},
        {name:"higherClassification"},
        {name:"eventDate"},
        {name:"DateAccuracy"},
        {name:"verbatimLocality"},
        {name:"Geoprivacy"},
        {name:"decimalLatitude"},
        {name:"decimalLongitude"},
        {name:"LocationScale"},
        {name:"FlagCount"},
        {name:"Flag Reason"},
        {name:"recordedBy"},
        {name:"createdon"},
        {name:"associatedMedia"}
    ],
    taxonomic: [
        {name:"previousIdentifications"},
        {name:"previousVernacularNames"},
        {name:"SpeciesPageID"},
        {name:"higherClassificationIDs"}],
    temporal: [
        {name:"To_date"},
        {name:"Month"},
        {name:"LastRevised"}],
    spatial: [
        {name:"ReverseGeocodedName"},
        {name:"State"},
        {name:"Tahsil/Taluk"},
        {name:"District"}
    ],
    misc: [
        {name:"No_of_Images"},
        {name:"datasetName"},
        {name:"ContainsMedia"},
        {name:"UploadProtocol"},
        {name:"organismRemarks"},
        {name:"Tags"},
        {name:"SpeciesGroup"}]
}