import { Box } from "@chakra-ui/core";
import { ENDPOINT, MAP_CENTER } from "@static/constants";
import { ExtendedMarkerProps } from "naksha-components-react/dist/interfaces/naksha";
import dynamic from "next/dynamic";
import React from "react";
import LazyLoad from "react-lazyload";

const Naksha = dynamic(() => import("naksha-components-react"), { ssr: false });

const onObservationGridClick = () => (
  <Box maxH="250px" overflow="auto" fontSize="sm">
    TODO: observation list
  </Box>
);

const onObservationGridHover = ({ feature }) => (
  <div>{feature?.properties?.count} Observations</div>
);

export default function ClusterMap({ speciesId, latitude, longitude, colorHex = "E53E3E" }) {
  return (
    <Box h="422px" borderRadius="md" overflow="hidden" className="gray-box fadeInUp delay-5" mb={2}>
      <LazyLoad height={422} once={true}>
        <Naksha
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          viewPort={{ latitude: MAP_CENTER.lat, longitude: MAP_CENTER.lng, zoom: 3.1 }}
          layers={[
            {
              id: "species-observations",
              title: "Species Observations",
              isAdded: true,
              source: {
                type: "grid",
                endpoint: `${ENDPOINT.NAKSHA}/observation/aggregation?index=extended_observation&type=extended_records&geoField=location&top={top}&left={left}&bottom={bottom}&right={right}&precision={precision}&speciesId=${speciesId}`
              },
              onHover: onObservationGridHover,
              onClick: onObservationGridClick
            }
          ]}
          markers={[{ latitude, longitude, colorHex }] as ExtendedMarkerProps[]}
        />
      </LazyLoad>
    </Box>
  );
}
