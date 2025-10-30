import { MapStyles } from "@biodiv-platform/naksha-commons";
import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT } from "@static/constants";
import { getMapCenter } from "@utils/location";
import { toPng } from "html-to-image";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import LazyLoad from "react-lazyload";

import useSpecies from "../../../use-species";

const NakshaMapboxList: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxList),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const onObservationGridHover = ({ feature }: any) => (
  <div>{feature?.properties?.count} Observations</div>
);

interface OccuranceRecoardSpeciesFieldProps {
  valueCallback: (loaded: boolean) => void;
}

const OccuranceRecoardSpeciesField = forwardRef(
  ({ valueCallback }: OccuranceRecoardSpeciesFieldProps, ref) => {
    const { species } = useSpecies();
    const defaultViewState = React.useMemo(() => getMapCenter(3.1), []);
    const { lang } = useTranslation();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [forceLoad, setForceLoad] = useState(false);

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
              backgroundColor: "#FFFFFF"
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
        <NakshaMapboxList
          defaultViewState={defaultViewState}
          loadToC={false}
          showToC={false}
          lang={lang}
          mapStyle={MapStyles.MAP_SATELLITE}
          mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          nakshaApiEndpoint={ENDPOINT.NAKSHA}
          geoserver={{
            endpoint: ENDPOINT.GEOSERVER,
            store: SITE_CONFIG.GEOSERVER.STORE,
            workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
          }}
          selectedLayers={["species-observations"]}
          layers={[
            {
              id: "species-observations",
              title: "Species Observations",
              source: { type: "grid", fetcher: fetchGridData },
              onHover: onObservationGridHover,
              data: {
                index: "extended_observation",
                type: "extended_records",
                geoField: "location",
                summaryColumn: ["count"],
                propertyMap: { count: "Count" }
              }
            }
          ]}
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
