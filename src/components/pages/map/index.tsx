import { Box } from "@chakra-ui/core";
import SITE_CONFIG from "@configs/site-config.json";
import { ENDPOINT } from "@static/constants";
import Naksha from "naksha-components-react";
import React from "react";

export default function MapPageComponent() {
  const onObservationGridHover = ({ feature }) => (
    <div>{feature?.properties?.count} Observations</div>
  );

  return (
    <Box height="calc(100vh - var(--heading-height))">
      <Naksha
        viewPort={{
          ...SITE_CONFIG.MAP.CENTER,
          zoom: 3.5,
          bearing: 0,
          pitch: 0
        }}
        loadToC={true}
        showToC={false}
        mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
        nakshaApiEndpoint={ENDPOINT.NAKSHA}
        geoserver={{
          endpoint: ENDPOINT.GEOSERVER,
          store: SITE_CONFIG.GEOSERVER.STORE,
          workspace: SITE_CONFIG.GEOSERVER.WORKSPACE
        }}
        layers={[
          {
            id: "global-observations",
            title: "Observations",
            isAdded: true,
            source: {
              type: "grid",
              endpoint: `${ENDPOINT.ESMODULE}/v1/geo/aggregation`
            },
            data: {
              index: "extended_observation",
              type: "extended_records",
              geoField: "location"
            },
            onHover: onObservationGridHover
          }
        ]}
      />
    </Box>
  );
}
