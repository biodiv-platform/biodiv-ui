import { Box, Button, HStack, Menu, Stack, Text } from "@chakra-ui/react";
import { MenuContent, MenuRadioItemGroup, MenuRoot, MenuTrigger } from "@components/ui/menu";
import { LuCheck, LuChevronDown, LuLayers } from "react-icons/lu";

import { DENSITY_BREAKS, DENSITY_PALETTE, OCCURRENCE_SOURCES, OccurrenceSource } from "./constants";
import { OccurrenceTotals } from "./use-occurrence-grid";

const PANEL_PROPS = {
  position: "absolute",
  zIndex: 1,
  bg: "white",
  borderRadius: "md",
  boxShadow: "md"
} as const;

interface OccurrenceSourceMenuProps {
  value: OccurrenceSource;
  onChange: (value: OccurrenceSource) => void;
}

/** "Source: All / IBP / GBIF" dropdown at the top-left of an occurrence map */
export function OccurrenceSourceMenu({ value, onChange }: OccurrenceSourceMenuProps) {
  const selected = OCCURRENCE_SOURCES.find((s) => s.value === value);

  return (
    <Box position="absolute" top={2} left={2} zIndex={1} data-capture-ignore="true">
      <MenuRoot positioning={{ placement: "bottom-start" }}>
        <MenuTrigger asChild>
          <Button size="xs" variant="outline" bg="white" boxShadow="sm">
            <LuLayers />
            Source: {selected?.label}
            <LuChevronDown />
          </Button>
        </MenuTrigger>
        <MenuContent minW="140px">
          <MenuRadioItemGroup
            value={value}
            onValueChange={(e) => onChange(e.value as OccurrenceSource)}
          >
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

/** Records in the current view: total, then per source when there is more than one */
export function OccurrenceTotalsPanel({ totals }: { totals?: OccurrenceTotals }) {
  if (!totals) return null;

  const sources = OCCURRENCE_SOURCES.filter(
    ({ value }) => value !== "all" && totals[value] !== undefined
  );

  return (
    <Box {...PANEL_PROPS} top={2} right={2} px={3} py={2}>
      <Text fontSize="sm" color="gray.600">
        <Text as="span" fontSize="lg" fontWeight="bold" color="gray.800">
          {totals.count.toLocaleString()}
        </Text>{" "}
        observations in view
      </Text>
      {sources.length > 1 && (
        <HStack gap={4} mt={1} pt={1} borderTopWidth="1px" borderColor="gray.100">
          {sources.map(({ value, label, color }) => (
            <Stack key={value} gap={0}>
              <HStack gap={1}>
                <Box boxSize={2} borderRadius="full" bg={color} />
                <Text fontSize="xs" color="gray.600">
                  {label}
                </Text>
              </HStack>
              <Text fontSize="sm" fontWeight="semibold">
                {totals[value]!.toLocaleString()}
              </Text>
            </Stack>
          ))}
        </HStack>
      )}
    </Box>
  );
}

/** 1000 -> "1k" */
const formatCount = (count: number) => (count >= 1000 ? `${count / 1000}k` : `${count}`);

/** Tick under each colour boundary: 1, then the highest count of each step but the last */
const DENSITY_TICKS = ["1", ...DENSITY_BREAKS.map((start) => formatCount(start - 1))];

/**
 * Density legend at the bottom-left of an occurrence map: one
 * segmented colour bar, each colour running between the ticks under it (the last is 5k+)
 */
export function DensityLegend() {
  const segment = 100 / DENSITY_PALETTE.length;

  return (
    <Box {...PANEL_PROPS} bottom={2} left={2} px={2.5} py={1.5}>
      <Text fontSize="2xs" fontWeight="semibold" color="gray.700" mb={1}>
        Observations per cell
      </Text>
      <Box w={{ base: "150px", md: "168px" }}>
        <HStack gap={0} h="8px" borderRadius="sm" overflow="hidden">
          {DENSITY_PALETTE.map((color) => (
            <Box key={color} flex={1} h="full" bg={color} />
          ))}
        </HStack>
        <Box position="relative" h="12px" mt={0.5}>
          {DENSITY_TICKS.map((tick, index) => (
            <Text
              key={tick}
              position="absolute"
              left={`${index * segment}%`}
              transform={index ? "translateX(-50%)" : undefined}
              fontSize="2xs"
              lineHeight="12px"
              color="gray.600"
            >
              {tick}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
