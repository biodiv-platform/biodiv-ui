import { axGetGBIFTaxonGrid } from "@services/external-occurrences.service";
import { useMemo, useState } from "react";

import OccurrenceCellSummary from "./cell-summary";
import {
  DENSITY_BREAKS,
  DENSITY_CELL_OUTLINE,
  DENSITY_PALETTE,
  getOccurrenceLayerId,
  OCCURRENCE_SOURCES,
  OccurrenceSource
} from "./constants";

type GeohashCounts = Record<string, number>;

/** Grid cell: total `count` plus the count from each source that was fetched */
type OccurrenceCell = { count: number; ibp?: number; gbif?: number };

export type OccurrenceTotals = OccurrenceCell;

/** Combines per-source {geohash: count} into {geohash: {count, ibp?, gbif?}} */
const toCells = (counts: Partial<Record<"ibp" | "gbif", GeohashCounts>>) => {
  const present = Object.keys(counts).filter((name) => counts[name]);
  const cells: Record<string, OccurrenceCell> = {};

  for (const name of present) {
    for (const [geohash, count] of Object.entries(counts[name] as GeohashCounts)) {
      cells[geohash] ??= {
        count: 0,
        ...Object.fromEntries(present.map((source) => [source, 0]))
      };
      cells[geohash].count += count;
      cells[geohash][name] += count;
    }
  }
  return cells;
};

const sumCells = (cells: Record<string, OccurrenceCell>, present: string[]) =>
  Object.values(cells).reduce<OccurrenceTotals>(
    (total, cell) => {
      total.count += cell.count;
      for (const source of present) total[source] += cell[source];
      return total;
    },
    { count: 0, ...Object.fromEntries(present.map((source) => [source, 0])) }
  );

/**
 * naksha grid layers for IBP observations and GBIF occurrences of a taxon, one per source,
 * plus the selected source and the record totals of the last fetched view
 *
 * @param taxonId IBP taxon whose records are shown
 * @param fetchIbpGridData fetcher for the IBP observation grid ({geohash: count})
 */
export default function useOccurrenceGrid(taxonId, fetchIbpGridData) {
  const [source, setSource] = useState<OccurrenceSource>("all");
  const [totals, setTotals] = useState<Partial<Record<OccurrenceSource, OccurrenceTotals>>>({});

  // naksha keeps the layers it was first given, so they are built once per taxon
  const layers = useMemo(() => {
    const fetchGBIFGridData = async (geoProps) => {
      const { data } = await axGetGBIFTaxonGrid(taxonId, geoProps);
      return data;
    };

    const getFetcher = (layerSource: OccurrenceSource) => async (geoProps) => {
      const [ibp, gbif] = await Promise.all([
        layerSource !== "gbif" ? fetchIbpGridData(geoProps) : undefined,
        layerSource !== "ibp" ? fetchGBIFGridData(geoProps) : undefined
      ]);
      const counts = {
        ...(layerSource !== "gbif" && { ibp: ibp || {} }),
        ...(layerSource !== "ibp" && { gbif: gbif || {} })
      };
      const cells = toCells(counts);
      setTotals((all) => ({ ...all, [layerSource]: sumCells(cells, Object.keys(counts)) }));
      return cells;
    };

    return OCCURRENCE_SOURCES.map(({ value, label }) => ({
      id: getOccurrenceLayerId(value),
      title: `${label} Occurrences`,
      source: {
        type: "grid",
        fetcher: getFetcher(value),
        colors: DENSITY_PALETTE,
        breaks: DENSITY_BREAKS,
        outlineColor: DENSITY_CELL_OUTLINE,
        opacity: 0.85
      },
      onHover: ({ feature }) => <OccurrenceCellSummary properties={feature?.properties} />,
      onClick: ({ feature, bbox }) => (
        <OccurrenceCellSummary properties={feature?.properties} bbox={bbox} taxonId={taxonId} />
      ),
      data: {
        index: "extended_observation",
        type: "extended_records",
        geoField: "location",
        summaryColumn: ["count"],
        propertyMap: { count: "Count" }
      }
    }));
  }, [taxonId]);

  return {
    source,
    setSource,
    totals: totals[source],
    layers,
    selectedLayers: [getOccurrenceLayerId(source)]
  };
}
