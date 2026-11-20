import { axGetGBIFTaxonMonthYear } from "@services/external-occurrences.service";
import { useEffect, useState } from "react";

export interface GBIFMonthYearCount {
  year: number;
  /** 1 to 12 */
  month: number;
  count: number;
}

interface GBIFMonthYearResult {
  /** taxon the counts belong to */
  taxonId?: string | number;
  /** earliest and latest year with records, undefined when the taxon has none */
  minYear?: number;
  maxYear?: number;
  counts: GBIFMonthYearCount[];
}

/**
 * GBIF record counts per year and month for an IBP taxon, all years in one request
 *
 * @param taxonId IBP taxon; nothing is fetched when undefined
 */
export default function useGBIFMonthYear(taxonId?: string | number) {
  const [result, setResult] = useState<GBIFMonthYearResult>({ counts: [] });

  useEffect(() => {
    if (!taxonId) return;

    let cancelled = false;
    axGetGBIFTaxonMonthYear(taxonId).then(({ data }) => {
      if (cancelled) return;
      setResult({
        taxonId,
        minYear: data?.minYear ?? undefined,
        maxYear: data?.maxYear ?? undefined,
        counts: data?.counts || []
      });
    });

    return () => {
      cancelled = true;
    };
  }, [taxonId]);

  // loading until the counts for this taxon have arrived
  const isLoading = !!taxonId && result.taxonId !== taxonId;

  return { ...result, isLoading };
}
