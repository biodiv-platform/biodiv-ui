import { Box, Button, HStack, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import {
  OCCURRENCE_SOURCES,
  OccurrenceSource
} from "@components/pages/common/occurrence-map/constants";
import DownloadIcon from "@icons/download";
import { axAddDownloadLog } from "@services/user.service";
import { Months } from "@static/constants";
import { waitForAuth } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { toaster } from "@/components/ui/toaster";

import StackedHorizontalChart from "./stacked-horizontal-chart";
import useGBIFMonthYear from "./use-gbif-month-year";
import useTemporalDistributionMonthObserved from "./use-temporal-distribution-month-observed";

interface TemporalObservedOnProps {
  filter: any;
  /** adds GBIF occurrences and a Source (All / IBP / GBIF) dropdown; needs `filter.taxon` */
  showGBIF?: boolean;
}

function get50YearIntervalKeys(maxYear, minYear) {
  const intervals: string[] = [];

  maxYear = parseInt(maxYear, 10);
  minYear = parseInt(minYear, 10);

  let end = maxYear;

  while (end >= minYear) {
    const start = Math.max(end - 49, 0); // 50-year span
    const key = `${String(start).padStart(4, "0")}-${String(end).padStart(4, "0")}`;
    intervals.push(key);
    end = start - 1; // next interval block
  }

  return intervals;
}

/** Adds up chart rows ({month, year, value}) that share a month and year */
const sumByMonthAndYear = (rows) => {
  const totals = new Map<string, { month: string; year: string; value: number }>();
  for (const { month, year, value } of rows) {
    const key = `${month}|${year}`;
    const total = totals.get(key) || { month, year: String(year), value: 0 };
    total.value += Number(value) || 0;
    totals.set(key, total);
  }
  return Array.from(totals.values());
};

const TemporalObservedOn = forwardRef(({ filter, showGBIF }: TemporalObservedOnProps, ref) => {
  const observedOn = useTemporalDistributionMonthObserved({ filter });
  const gbifTaxonId = showGBIF ? filter?.taxon : undefined;
  const gbif = useGBIFMonthYear(gbifTaxonId);
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [source, setSource] = useState<OccurrenceSource>("all");
  const chartRef = useRef<any>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const withGBIF = !!gbifTaxonId;
  const includeIBP = !withGBIF || source !== "gbif";
  const includeGBIF = withGBIF && source !== "ibp";

  // years covered by the sources shown
  const ranges: number[][] = [];
  if (includeIBP && observedOn.data.hasData) {
    ranges.push([parseInt(observedOn.data.minDate, 10), parseInt(observedOn.data.maxDate, 10)]);
  }
  if (includeGBIF && gbif.minYear !== undefined && gbif.maxYear !== undefined) {
    ranges.push([gbif.minYear, gbif.maxYear]);
  }
  const years = ranges.length
    ? get50YearIntervalKeys(
        Math.max(...ranges.map(([, max]) => max)),
        Math.min(...ranges.map(([min]) => min))
      )
    : [];
  const interval = years[currentIndex] || years[0];

  // IBP counts are fetched per 50-year interval. loadMore is a new function on every render, so
  // it is read from a ref: as a dependency it would refetch the interval while one is loading
  const loadMoreRef = useRef(observedOn.loadMore);
  useEffect(() => {
    loadMoreRef.current = observedOn.loadMore;
  });
  useEffect(() => {
    if (includeIBP && interval && observedOn.data.hasData) {
      loadMoreRef.current(interval);
    }
  }, [interval, includeIBP, observedOn.data.hasData]);

  useImperativeHandle(ref, () => ({
    base64: () => {
      if (chartRef.current) {
        return chartRef.current.getBase64();
      }
    }
  }));

  const handleDownload = async () => {
    try {
      await waitForAuth();
      if (chartRef.current) {
        chartRef.current.downloadChart();
        const payload = {
          filePath: "",
          filterUrl: window.location.href,
          status: "success",
          fileType: "png",
          sourcetype: "Observations",
          notes: "Temporal Distribution - Month Observed"
        };
        axAddDownloadLog(payload);
      }
    } catch (error) {
      console.error("Download error:", error);
      toaster.create({
        title: "Error while downloading",
        type: "error",
        closable: true
      });
    }
  };

  const ibpPending =
    includeIBP && observedOn.data.isLoading && !(interval && observedOn.data.list[interval]);
  if (ibpPending || (includeGBIF && gbif.isLoading)) {
    return <Skeleton h={450} borderRadius="md" mb={4} />;
  }

  if (!interval) {
    return <div></div>;
  }

  const [startYear, endYear] = interval.split("-").map((year) => parseInt(year, 10));
  const ibpRows = includeIBP ? observedOn.data.list[interval] || [] : [];
  const gbifRows = includeGBIF
    ? gbif.counts
        .filter(({ year }) => year >= startYear && year <= endYear)
        .map(({ year, month, count }) => ({
          month: Months[month - 1],
          year: String(year),
          value: count
        }))
    : [];
  const data = withGBIF ? sumByMonthAndYear([...ibpRows, ...gbifRows]) : ibpRows;

  const handleOnChange = (e) => {
    setCurrentIndex(parseInt(e?.target?.value, 10));
  };

  const handleSourceChange = (e) => {
    setSource(e?.target?.value);
    setCurrentIndex(0);
  };

  const yearSelect = (
    <NativeSelectRoot
      key={source}
      fontSize="13px"
      maxW="7rem"
      defaultValue={currentIndex}
      onChange={handleOnChange}
    >
      <NativeSelectField>
        {years.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
      </NativeSelectField>
    </NativeSelectRoot>
  );

  return (
    <Box className="white-box" mb={4}>
      <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
        📊 {t("observation:list.chart.temporal_distribution_date_observed")}{" "}
        <Button onClick={handleDownload} variant="ghost" colorPalette="blue">
          <DownloadIcon />
        </Button>
      </BoxHeading>
      <Box p={4}>
        {withGBIF ? (
          <HStack justify="flex-end" gap={2} flexWrap="wrap" py="25px">
            <NativeSelectRoot fontSize="13px" maxW="8rem" onChange={handleSourceChange}>
              <NativeSelectField value={source}>
                {OCCURRENCE_SOURCES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    Source: {label}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
            {yearSelect}
          </HStack>
        ) : (
          <Box marginLeft="45%" paddingTop="25px" paddingBottom="25px">
            {yearSelect}
          </Box>
        )}
        <div ref={chartContainerRef}>
          <StackedHorizontalChart data={data} ref={chartRef} isStacked={true} />
        </div>
      </Box>
    </Box>
  );
});

export default TemporalObservedOn;
