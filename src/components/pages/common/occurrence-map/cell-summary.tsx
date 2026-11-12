import { Box, HStack, Link, Stack, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { LuArrowRight } from "react-icons/lu";

import { OCCURRENCE_SOURCES } from "./constants";

interface OccurrenceCellSummaryProps {
  /** grid cell properties: `count` plus a count per source that was fetched */
  properties: Record<string, number>;
  /** cell [minLon, minLat, maxLon, maxLat]; with `taxonId` adds a link to the observation list */
  bbox?: number[];
  taxonId?: number;
}

/** Observation list filter value for a box: closed ring of "lon,lat" pairs */
const toLocationFilter = ([west, south, east, north]: number[]) =>
  [west, south, east, south, east, north, west, north, west, south].join(",");

/** Records in one grid cell, split by source, shown in the map popup */
export default function OccurrenceCellSummary({
  properties,
  bbox,
  taxonId
}: OccurrenceCellSummaryProps) {
  const count = properties?.count || 0;
  const sources = OCCURRENCE_SOURCES.filter(
    ({ value }) => value !== "all" && properties?.[value] !== undefined
  );

  return (
    <Stack gap={1} minW="180px" fontSize="sm" color="gray.800">
      <Text fontWeight="bold" fontSize="md">
        {count.toLocaleString()} observations
      </Text>
      {sources.length > 1 &&
        sources.map(({ value, label, color }) => (
          <HStack key={value} gap={2}>
            <Box boxSize={2} borderRadius="full" bg={color} />
            <Text flex={1}>{label}:</Text>
            <Text>
              {properties[value].toLocaleString()} (
              {count ? ((properties[value] / count) * 100).toFixed(1) : 0}%)
            </Text>
          </HStack>
        ))}
      {bbox && taxonId && properties?.ibp ? (
        <LocalLink
          href="/observation/list"
          params={{
            taxon: taxonId,
            location: toLocationFilter(bbox),
            geoShapeFilterField: "location"
          }}
          prefixGroup={true}
        >
          <Link color="blue.600" fontSize="sm" mt={1}>
            View IBP observations <LuArrowRight />
          </Link>
        </LocalLink>
      ) : null}
    </Stack>
  );
}
