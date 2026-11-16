export type OccurrenceSource = "all" | "ibp" | "gbif";

/** Where the grid counts come from; "all" adds IBP and GBIF counts per cell */
export const OCCURRENCE_SOURCES: { value: OccurrenceSource; label: string; color: string }[] = [
  { value: "all", label: "All", color: "gray.500" },
  { value: "ibp", label: "IBP", color: "purple.500" },
  { value: "gbif", label: "GBIF", color: "green.500" }
];

/**
 * Density palettes, six steps from low to high.
 *
 * magma, inferno, plasma and viridis are made for the dark Fiord basemap: each is the bright end
 * of the scientific colour map, cut so even the lowest step stands apart from the slate-blue
 * background, with brightness rising with density so busy areas glow. They are perceptually even
 * and colour-blind friendly.
 */
export const DENSITY_PALETTES = {
  /** Magma from 0.49: raspberry to coral to peach to cream; soft and warm */
  magma: ["#B3367A", "#DB4869", "#F66E5D", "#FE9D6C", "#FECE91", "#FCFDBF"],
  /** Inferno from 0.50: crimson to orange to amber to pale yellow; reads as heat / hotspots */
  inferno: ["#BC3754", "#DD513A", "#F37819", "#FCA50A", "#F6D746", "#FCFFA4"],
  /** Plasma from 0.42: magenta to coral to orange to gold to yellow; the most vivid */
  plasma: ["#B6308B", "#D45170", "#EA7556", "#F99B3D", "#FCC828", "#F0F921"],
  /** Viridis from 0.36: teal to green to lime to yellow; calm, the only cool option */
  viridis: ["#2E6E8E", "#228E8C", "#27AC81", "#5CC762", "#AADB32", "#FDE725"],
  /** ColorBrewer YlOrRd: yellow to orange to red, as on the IBP map page (naksha's default) */
  ylOrRd: ["#FFFFB2", "#FED976", "#FEB24C", "#FD8D3C", "#F03B20", "#BD0026"],
  /** ColorBrewer OrRd: amber to orange to red */
  orRd: ["#FEE8C8", "#FDD49E", "#FDBB84", "#FC8D59", "#E34A33", "#B30000"],
  /** yellow to green to teal to blue to purple */
  multihue: ["#FFB800", "#C7E9A0", "#69CFA3", "#2CA6B8", "#3B6FB6", "#54278F"]
};

export const DENSITY_PALETTE = DENSITY_PALETTES.ylOrRd;

/** Lowest count of each density step after the first */
export const DENSITY_BREAKS = [11, 51, 201, 1001, 5001];

export const DENSITY_LABELS = ["1–10", "11–50", "51–200", "201–1k", "1k–5k", "5k+"];

/** Thin dark cell borders keep neighbouring cells apart on the dark basemap */
export const DENSITY_CELL_OUTLINE = "rgba(20, 24, 36, 0.5)";

/** naksha grid layer id for an occurrence source */
export const getOccurrenceLayerId = (source: OccurrenceSource) => `occurrences-${source}`;
