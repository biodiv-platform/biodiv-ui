export type OccurrenceSource = "all" | "ibp" | "gbif";

/** Where the grid counts come from; "all" adds IBP and GBIF counts per cell */
export const OCCURRENCE_SOURCES: { value: OccurrenceSource; label: string; color: string }[] = [
  { value: "all", label: "All", color: "gray.500" },
  { value: "ibp", label: "IBP", color: "purple.500" },
  { value: "gbif", label: "GBIF", color: "green.500" }
];

/** Density palettes, six steps from low to high */
export const DENSITY_PALETTES = {
  /** ColorBrewer OrRd: amber to orange to red */
  orRd: ["#FEE8C8", "#FDD49E", "#FDBB84", "#FC8D59", "#E34A33", "#B30000"],
  /** yellow to green to teal to blue to purple */
  multihue: ["#FFB800", "#C7E9A0", "#69CFA3", "#2CA6B8", "#3B6FB6", "#54278F"]
};

export const DENSITY_PALETTE = DENSITY_PALETTES.orRd;

/** Lowest count of each density step after the first */
export const DENSITY_BREAKS = [11, 51, 201, 1001, 5001];

export const DENSITY_LABELS = ["1–10", "11–50", "51–200", "201–1k", "1k–5k", "5k+"];

/** Thin white cell borders keep neighbouring cells apart */
export const DENSITY_CELL_OUTLINE = "#FFFFFF";

/** naksha grid layer id for an occurrence source */
export const getOccurrenceLayerId = (source: OccurrenceSource) => `occurrences-${source}`;
