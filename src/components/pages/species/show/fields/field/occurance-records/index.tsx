// import { MapStyles } from "@biodiv-platform/naksha-commons";
import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { axGetObservationMapData } from "@services/observation.service";
import { ENDPOINT } from "@static/constants";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
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

export default function OccuranceRecoardSpeciesField({ valueCallback }) {
  const { species } = useSpecies();
  const defaultViewState = React.useMemo(() => getMapCenter(3.1), []);
  const { lang } = useTranslation();

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

  return (
    <LazyLoad once={true}>
      <Box h="500px" overflow="hidden" position="relative" borderRadius="md" bg="gray.300" mb={4}>
        <NakshaMaplibreLayers
          defaultViewState={defaultViewState}
          loadToC={false}
          showToC={false}
          lang={lang}
          mapStyle={"0"}
          // mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
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
    </LazyLoad>
  );
}
