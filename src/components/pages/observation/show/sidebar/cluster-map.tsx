import { Box } from "@chakra-ui/react";
import { axGetObservationMapData } from "@services/observation.service";
import { getMapCenter } from "@utils/location";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import LazyLoad from "react-lazyload";

import { mapStyles } from "@/static/constants";

const NakshaMaplibreLayers: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMaplibreLayers),
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
  const { lang } = useTranslation();
  const defaultViewState = React.useMemo(
    () => getMapCenter(3.1, latitude ? { latitude, longitude } : {}),
    []
  );

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
      className="gray-box"
      display="block"
    >
      <LazyLoad height={422} once={true}>
        <NakshaMaplibreLayers
          defaultViewState={defaultViewState}
          key={k}
          lang={lang}
          selectedLayers={filter ? ["species-observations"] : []}
          mapStyles={mapStyles}
          layers={[
            {
              id: "species-observations",
              title: "Species Observations",
              source: { type: "grid", fetcher: fetchGridData },
              onHover: onObservationGridHover,
              onClick: onObservationGridClick,
              data: {
                index: "extended_observation",
                type: "extended_records",
                geoField: "location",
                summaryColumn: ["count"],
                propertyMap: { count: "Count" }
              }
            }
          ]}
          markers={latitude ? [{ latitude, longitude, colorHex }] : []}
        />
      </LazyLoad>
    </Box>
  );
}
