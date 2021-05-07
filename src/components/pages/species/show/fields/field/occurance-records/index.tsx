import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { BaseLayer } from "@ibp/naksha-commons";
import { ENDPOINT } from "@static/constants";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
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

export default function OccuranceRecoardSpeciesField({ valueCallback }) {
  const { species } = useSpecies();
  const defaultViewPort = React.useMemo(() => getMapCenter(3.1), []);

  useEffect(() => {
    valueCallback(true);
  }, []);

  return (
    <LazyLoad once={true}>
      <Box h="500px" overflow="hidden" position="relative" borderRadius="md" bg="gray.300" mb={4}>
        <NakshaMapboxList
          viewPort={defaultViewPort}
          loadToC={false}
          showToC={false}
          baseLayer={BaseLayer.MAP_SATELLITE}
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          nakshaApiEndpoint={ENDPOINT.NAKSHA}
          geoserver={{
            endpoint: ENDPOINT.GEOSERVER,
            store: SITE_CONFIG.GEOSERVER.STORE,
            workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
          }}
          layers={[
            {
              id: "species-observations",
              title: "Species Observations",
              isAdded: true,
              source: {
                type: "grid",
                endpoint: `${ENDPOINT.ESMODULE}/v1/geo/aggregation`
              },
              data: {
                index: "extended_observation",
                type: "extended_records",
                geoField: "location",
                speciesId: species.species.id
              },
              onHover: onObservationGridHover
            }
          ]}
        />
      </Box>
    </LazyLoad>
  );
}
