import { Box, Button, Menu } from "@chakra-ui/react";
import { MenuContent, MenuRadioItemGroup, MenuRoot, MenuTrigger } from "@components/ui/menu";
import { axGetGBIFTaxonGrid } from "@services/external-occurrences.service";
import { LuCheck, LuChevronDown, LuLayers } from "react-icons/lu";

/** Where the grid counts come from; "all" adds IBP and GBIF counts per cell */
export const OCCURRENCE_SOURCES = [
  { value: "all", label: "All", color: "blue.500" },
  { value: "ibp", label: "IBP", color: "green.500" },
  { value: "gbif", label: "GBIF", color: "purple.500" }
];

/**
 * Grid fetchers for each occurrence source of a taxon
 *
 * @param taxonId IBP taxon whose GBIF occurrences are counted
 * @param fetchIbpGridData fetcher for the IBP observation grid
 */
export const getOccurrenceGridFetchers = (taxonId, fetchIbpGridData) => {
  const fetchGBIFGridData = async (geoProps) => {
    const { data } = await axGetGBIFTaxonGrid(taxonId, geoProps);
    return data;
  };

  const fetchAllGridData = async (geoProps) => {
    const [ibp, gbif] = await Promise.all([
      fetchIbpGridData(geoProps),
      fetchGBIFGridData(geoProps)
    ]);
    const counts = { ...ibp };
    for (const [geohash, count] of Object.entries(gbif || {})) {
      counts[geohash] = (counts[geohash] || 0) + (count as number);
    }
    return counts;
  };

  return { all: fetchAllGridData, ibp: fetchIbpGridData, gbif: fetchGBIFGridData };
};

/** naksha grid layer id for an occurrence source */
export const getOccurrenceLayerId = (source) => `occurrences-${source}`;

interface OccurrenceSourceMenuProps {
  value: string;
  onChange: (value: string) => void;
}

/** Source dropdown shown at the top-left of an occurrence map */
export default function OccurrenceSourceMenu({ value, onChange }: OccurrenceSourceMenuProps) {
  const selected = OCCURRENCE_SOURCES.find((s) => s.value === value);

  return (
    <Box position="absolute" top={2} left={2} zIndex={1} data-capture-ignore="true">
      <MenuRoot positioning={{ placement: "bottom-start" }}>
        <MenuTrigger asChild>
          <Button size="xs" variant="outline" bg="white" boxShadow="sm">
            <LuLayers />
            {selected?.label}
            <LuChevronDown />
          </Button>
        </MenuTrigger>
        <MenuContent minW="140px">
          <MenuRadioItemGroup value={value} onValueChange={(e) => onChange(e.value)}>
            {OCCURRENCE_SOURCES.map(({ value, label, color }) => (
              <Menu.RadioItem key={value} value={value}>
                <Box boxSize={2} borderRadius="full" bg={color} />
                <Menu.ItemText flex={1}>{label}</Menu.ItemText>
                <Menu.ItemIndicator>
                  <LuCheck />
                </Menu.ItemIndicator>
              </Menu.RadioItem>
            ))}
          </MenuRadioItemGroup>
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}
