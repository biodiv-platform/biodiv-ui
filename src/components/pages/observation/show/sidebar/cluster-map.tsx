import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { axGetObservationMapData } from "@services/observation.service";
import { getMapCenter } from "@utils/location";
import { ExtendedMarkerProps } from "naksha-components-react";
import dynamic from "next/dynamic";
import React from "react";
import LazyLoad from "react-lazyload";

const NakshaMapboxList: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxList),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

// TODO: observation map on click component
const onObservationGridClick = () => <Box maxH="250px" overflow="auto" fontSize="sm"></Box>;

const onObservationGridHover = ({ feature }) => (
  <div>{feature?.properties?.count} Observations</div>
);

interface ClusterMapProps {
  filter;
  latitude?;
  longitude?;
  k?;
  colorHex?;
  borderRadius?;
}

export default function ClusterMap({
  filter,
  latitude,
  longitude,
  k,
  colorHex = "E53E3E",
  borderRadius = "md"
}: ClusterMapProps) {
  const defaultViewPort = React.useMemo(() => getMapCenter(3.1), []);

  const fetchGridData = async (geoProps) => {
    const params = {
      ...geoProps,
      ...filter,
      view: "map",
      geoField: "location"
    };

    const { data } = await axGetObservationMapData(params);
    return data;
  };

  return (
    <Box
      h="422px"
      borderRadius={borderRadius}
      overflow="hidden"
      className="gray-box fadeInUp delay-5"
      display="block"
    >
      <LazyLoad height={422} once={true}>
        <NakshaMapboxList
          mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
          viewPort={defaultViewPort}
          key={k}
          layers={
            filter
              ? [
                  {
                    id: "species-observations",
                    title: "Species Observations",
                    isAdded: true,
                    source: { type: "grid", fetcher: fetchGridData },
                    onHover: onObservationGridHover,
                    onClick: onObservationGridClick
                  }
                ]
              : []
          }
          markers={latitude ? ([{ latitude, longitude, colorHex }] as ExtendedMarkerProps[]) : []}
        />
      </LazyLoad>
    </Box>
  );
}
