import { Box } from "@chakra-ui/core";
import { ENDPOINT, MAP_CENTER } from "@static/constants";
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
          latitude: MAP_CENTER.lat,
          longitude: MAP_CENTER.lng,
          zoom: 3.5,
          bearing: 0,
          pitch: 0
        }}
        loadToC={true}
        showToC={false}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        nakshaApiEndpoint={ENDPOINT.NAKSHA}
        geoserver={{ endpoint: ENDPOINT.GEOSERVER, store: "ibp", workspace: "biodiv" }}
        layers={[
          {
            id: "global-observations",
            title: "Observations",
            isAdded: true,
            source: {
              type: "grid",
              endpoint: `${ENDPOINT.NAKSHA}/observation/aggregation?index=extended_observation&type=extended_records&geoField=location&top={top}&left={left}&bottom={bottom}&right={right}&precision={precision}`
            },
            onHover: onObservationGridHover
          }
        ]}
      />
    </Box>
  );
}
