export const RECO_NAME = [
  {
    label: "ACCEPTED",
    value: "accepted",
    stat: "ACCEPTED"
  },
  {
    label: "SYNONYM",
    value: "synonym",
    stat: "SYNONYM"
  }
];

const TAXON_RANKS = [
  "Kingdom",
  "Phylum",
  "Class",
  "Order",
  "Superfamily",
  "Family",
  "Subfamily",
  "Genus",
  "Subgenus",
  "Species",
  "Infraspecies"
];

export const TAXON_RANK_OPTIONS = TAXON_RANKS.map((taxon) => ({
  label: taxon,
  value: taxon,
  stat: taxon
}));
