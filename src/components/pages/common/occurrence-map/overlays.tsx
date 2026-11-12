import { Box, Button, HStack, Menu, Stack, Text } from "@chakra-ui/react";
import { MenuContent, MenuRadioItemGroup, MenuRoot, MenuTrigger } from "@components/ui/menu";
import { LuCheck, LuChevronDown, LuLayers } from "react-icons/lu";

import { DENSITY_LABELS, DENSITY_PALETTE, OCCURRENCE_SOURCES, OccurrenceSource } from "./constants";
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

/** Six-step density legend at the bottom-left of an occurrence map */
export function DensityLegend() {
  return (
    <Box {...PANEL_PROPS} bottom={2} left={2} px={3} py={2}>
      <Text fontSize="xs" fontWeight="semibold" mb={1}>
        Observation density{" "}
        <Text as="span" fontWeight="normal" color="gray.500">
          (per grid cell)
        </Text>
      </Text>
      <HStack gap={1} align="start">
        {DENSITY_PALETTE.map((color, index) => (
          <Stack key={color} gap={0.5} align="center">
            <Box w={{ base: "28px", md: "36px" }} h="12px" borderRadius="sm" bg={color} />
            <Text fontSize="2xs" color="gray.600" whiteSpace="nowrap">
              {DENSITY_LABELS[index]}
            </Text>
          </Stack>
        ))}
      </HStack>
    </Box>
  );
}
