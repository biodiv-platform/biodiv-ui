import { Box, Button, Menu } from "@chakra-ui/react";
import { MenuContent, MenuRadioItemGroup, MenuRoot, MenuTrigger } from "@components/ui/menu";
import SITE_CONFIG from "@configs/site-config";
import { axGetGBIFTaxonGrid } from "@services/external-occurrences.service";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT, mapStyles } from "@static/constants";
import { getMapCenter } from "@utils/location";
import { toPng } from "html-to-image";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { LuCheck, LuChevronDown, LuLayers } from "react-icons/lu";
import LazyLoad from "react-lazyload";

import useSpecies from "../../../use-species";

const NakshaMaplibreLayers: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreLayers),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const onObservationGridHover = ({ feature }: any) => (
  <div>{feature?.properties?.count} Observations</div>
);

/** Where the grid counts come from; "all" adds IBP and GBIF counts per cell */
const OCCURRENCE_SOURCES = [
  { value: "all", label: "All", color: "blue.500" },
  { value: "ibp", label: "IBP", color: "green.500" },
  { value: "gbif", label: "GBIF", color: "purple.500" }
];

interface OccuranceRecoardSpeciesFieldProps {
  valueCallback: (loaded: boolean) => void;
}

const OccuranceRecoardSpeciesField = forwardRef(
  ({ valueCallback }: OccuranceRecoardSpeciesFieldProps, ref) => {
    const { species } = useSpecies();
    const defaultViewState = useMemo(() => getMapCenter(3.1), []);
    const { lang } = useTranslation();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [forceLoad, setForceLoad] = useState(false);
    const [source, setSource] = useState("all");

    const handleLoadMap = () => {
      setForceLoad(true);
    };

    useImperativeHandle(ref, () => ({
      captureMapAsBase64: async (): Promise<string | null> => {
        try {
          // Force load the map first
          if (!forceLoad) {
            handleLoadMap();
            await new Promise((resolve) => setTimeout(resolve, 4000));
          } else {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          if (!mapContainerRef.current) {
            console.error("Map container not found");
            return null;
          }

          try {
            const dataUrl = await toPng(mapContainerRef.current, {
              backgroundColor: "#FFFFFF",
              // leave the source dropdown out of the image
              filter: (node) => !(node instanceof HTMLElement && node.dataset.captureIgnore)
            });
            const parts = dataUrl.split(",");
            const pureBase64 = parts[1];
            const result = pureBase64;
            return result;
          } catch (error) {
            console.error("❌ Error in getBase64PNG:", error);
            return null;
          }
        } catch (error) {
          console.error("Error capturing map:", error);
          return null;
        }
      },
      getContainer: () => mapContainerRef.current,
      getMapData: () => ({
        speciesId: species.taxonomyDefinition.id,
        title: "Species Occurrence Map",
        type: "occurrence_map"
      })
    }));

    useEffect(() => {
      valueCallback(true);
    }, []);

    const fetchGridData = async (geoProps) => {
      const params = {
        ...geoProps,
        taxon: species.taxonomyDefinition.id,
        view: "map"
      };

      const { data } = await axGetObservationMapData(params);
      return data;
    };

    const fetchGBIFGridData = async (geoProps) => {
      const { data } = await axGetGBIFTaxonGrid(species.taxonomyDefinition.id, geoProps);
      return data;
    };

    const fetchAllGridData = async (geoProps) => {
      const [ibp, gbif] = await Promise.all([fetchGridData(geoProps), fetchGBIFGridData(geoProps)]);
      const counts = { ...ibp };
      for (const [geohash, count] of Object.entries(gbif || {})) {
        counts[geohash] = (counts[geohash] || 0) + (count as number);
      }
      return counts;
    };

    const gridFetchers = {
      all: fetchAllGridData,
      ibp: fetchGridData,
      gbif: fetchGBIFGridData
    };

    const selectedSource = OCCURRENCE_SOURCES.find((s) => s.value === source);

    const MapContent = (
      <Box
        ref={mapContainerRef}
        h="500px"
        overflow="hidden"
        position="relative"
        borderRadius="md"
        bg="gray.300"
        mb={4}
      >
        <Box position="absolute" top={2} left={2} zIndex={1} data-capture-ignore="true">
          <MenuRoot positioning={{ placement: "bottom-start" }}>
            <MenuTrigger asChild>
              <Button size="xs" variant="outline" bg="white" boxShadow="sm">
                <LuLayers />
                {selectedSource?.label}
                <LuChevronDown />
              </Button>
            </MenuTrigger>
            <MenuContent minW="140px">
              <MenuRadioItemGroup value={source} onValueChange={(e) => setSource(e.value)}>
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
        <NakshaMaplibreLayers
          defaultViewState={defaultViewState}
          loadToC={false}
          showToC={false}
          lang={lang}
          mapstyles={mapStyles}
          nakshaApiEndpoint={ENDPOINT.NAKSHA}
          geoserver={{
            endpoint: ENDPOINT.GEOSERVER,
            store: SITE_CONFIG.GEOSERVER.STORE,
            workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
          }}
          selectedLayers={[`occurrences-${source}`]}
          layers={OCCURRENCE_SOURCES.map(({ value, label }) => ({
            id: `occurrences-${value}`,
            title: `${label} Occurrences`,
            source: { type: "grid", fetcher: gridFetchers[value] },
            onHover: onObservationGridHover,
            data: {
              index: "extended_observation",
              type: "extended_records",
              geoField: "location",
              summaryColumn: ["count"],
              propertyMap: { count: "Count" }
            }
          }))}
        />
      </Box>
    );

    return forceLoad ? (
      MapContent
    ) : (
      <LazyLoad once={true} height={500}>
        {MapContent}
      </LazyLoad>
    );
  }
);

OccuranceRecoardSpeciesField.displayName = "OccuranceRecoardSpeciesField";

export default OccuranceRecoardSpeciesField;
