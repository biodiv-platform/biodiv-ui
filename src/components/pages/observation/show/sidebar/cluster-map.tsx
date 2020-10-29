import { Box } from "@chakra-ui/core";
import SITE_CONFIG from "@configs/site-config.json";
import { ENDPOINT } from "@static/constants";
import { getMapCenter } from "@utils/location";
import { ExtendedMarkerProps } from "naksha-components-react/dist/interfaces/naksha";
import dynamic from "next/dynamic";
import React from "react";
import LazyLoad from "react-lazyload";

const Naksha = dynamic(() => import("naksha-components-react"), { ssr: false });

// TODO: observation map on click component
const onObservationGridClick = () => <Box maxH="250px" overflow="auto" fontSize="sm"></Box>;

const onObservationGridHover = ({ feature }) => (
  <div>{feature?.properties?.count} Observations</div>
);

interface ClusterMapProps {
  filter;
  latitude;
  longitude;
  colorHex?;
  borderRadius?;
}

export default function ClusterMap({
  filter,
  latitude,
  longitude,
  colorHex = "E53E3E",
  borderRadius = "md"
}: ClusterMapProps) {
  const defaultViewPort = React.useMemo(() => getMapCenter(3.1), []);

  return (
    <Box
      h="422px"
      borderRadius={borderRadius}
      overflow="hidden"
      className="gray-box fadeInUp delay-5"
    >
      <LazyLoad height={422} once={true}>
        <Naksha
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          viewPort={defaultViewPort}
          layers={
            filter
              ? [
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
                      ...filter
                    },
                    onHover: onObservationGridHover,
                    onClick: onObservationGridClick
                  }
                ]
              : []
          }
          markers={[{ latitude, longitude, colorHex }] as ExtendedMarkerProps[]}
        />
      </LazyLoad>
    </Box>
  );
}
