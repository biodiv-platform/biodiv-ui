import { Box } from "@chakra-ui/core";
import useObservationFilter from "@hooks/useObservationFilter";
import { MAP_CENTER } from "@static/constants";
import { stringToFeature } from "@utils/location";
import { MapAreaDraw } from "naksha-components-react";
import React, { useMemo, useEffect, useState } from "react";

const defaultViewPort = {
  latitude: MAP_CENTER.lat,
  longitude: MAP_CENTER.lng,
  zoom: 2.8,
  bearing: 0,
  pitch: 0
};

export default function MapInputForm({ form, name }) {
  const { filter } = useObservationFilter();
  const { register, setValue } = form;
  const [coordinates, setCoordinated] = useState(form?.control?.defaultValuesRef?.current[name]);
  const defaultFeatures = useMemo(() => stringToFeature(coordinates || filter?.location), []);

  const handleOnFeatureChange = (features) => {
    if (features.length > 0) {
      setCoordinated({
        ne: features[0].geometry.coordinates[0][0],
        se: features[0].geometry.coordinates[0][2]
      });
    } else {
      setCoordinated({});
    }
  };

  useEffect(() => {
    setValue(name, coordinates);
  }, [coordinates]);

  useEffect(() => {
    register({ name });
  }, [register]);

  return (
    <Box position="relative" h="22rem">
      <MapAreaDraw
        defaultViewPort={defaultViewPort}
        defaultFeatures={defaultFeatures}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        onFeaturesChange={handleOnFeatureChange}
        isPolygon={false}
      />
    </Box>
  );
}
