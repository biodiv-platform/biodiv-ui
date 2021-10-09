import { Box, FormControl, FormLabel, Input, SimpleGrid } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import center from "@turf/center";
import { feature } from "@turf/helpers";
import { getMapCenter } from "@utils/location";
import notification from "@utils/notification";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import wkt from "wkt";

import GeoJSONPreview from "../map-preview/geojson";
import SaveButton from "./save-button";

const NakshaMapboxDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

export interface WKTProps {
  name: string;
  label: string;
  nameTitle: string;
  nameTopology: string;
  centroid: string;
  labelTitle: string;
  labelTopology: string;
  mb?: number;
  disabled?: boolean;
  onSave;
}

export default function WKTDrawViewer({
  nameTitle,
  nameTopology,
  labelTitle,
  labelTopology,
  centroid,
  mb = 4,
  disabled,
  onSave
}: WKTProps) {
  const WKTInputRef: any = useRef(null);
  const TitleInputRef: any = useRef(null);
  const defaultViewPort = React.useMemo(() => getMapCenter(2), []);

  const [geojson, setGeojson] = useState<any>();

  const handleOnSave = () => {
    const titleValue = TitleInputRef.current.value;
    if (titleValue && geojson) {
      onSave({
        [nameTitle]: titleValue,
        [nameTopology]: wkt.stringify(geojson),
        [centroid]: center(feature(geojson))
      });

      // Reset Fields
      TitleInputRef.current.value = "";
      WKTInputRef.current.value = "";
    } else {
      notification("Valid PlaceName and WKT both are required");
    }
  };

  const onWKTInputChange = () => {
    try {
      setGeojson(wkt.parse(WKTInputRef.current.value));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMapDraw = (geoJson) => {
    if (geoJson.length > 0) {
      WKTInputRef.current.value = wkt.stringify(geoJson[0]);
      setGeojson(wkt.parse(WKTInputRef.current.value));
    } else {
      WKTInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!disabled) {
      WKTInputRef.current.value = "";
      setGeojson(undefined);
    }
  }, [disabled]);
  return (
    <div>
      <SimpleGrid columns={[1, 1, 7, 7]} spacing={4} mb={mb}>
        <FormControl gridColumn="1/4">
          <FormLabel htmlFor={nameTitle}>{labelTitle}</FormLabel>
          <Input
            id={nameTitle}
            ref={TitleInputRef}
            name={nameTitle}
            placeholder={labelTitle}
            isDisabled={disabled}
          />
        </FormControl>
        <FormControl gridColumn="4/7">
          <FormLabel htmlFor={nameTopology}>{labelTopology}</FormLabel>
          <Input
            name={nameTopology}
            id={nameTopology}
            ref={WKTInputRef}
            placeholder={labelTopology}
            onChange={onWKTInputChange}
            isDisabled={disabled}
          />
        </FormControl>
        <SaveButton isDisabled={disabled} onClick={handleOnSave} />
      </SimpleGrid>
      {geojson ? (
        <GeoJSONPreview data={geojson} />
      ) : (
        <Box position="relative" h="22rem">
          <NakshaMapboxDraw
            defaultViewPort={defaultViewPort}
            mapboxApiAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
            onFeaturesChange={handleMapDraw}
            isControlled={true}
            isPolygon={true}
          />
        </Box>
      )}
    </div>
  );
}
