import { FormControl, FormLabel, Input, SimpleGrid } from "@chakra-ui/react";
import notification from "@utils/notification";
import React, { useRef, useState } from "react";
import wkt from "wkt";
import { feature } from "@turf/helpers";
import center from "@turf/center";
import GeoJSONPreview from "../map-preview/geojson";
import SaveButton from "./save-button";

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

export default function WKT({
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
      setGeojson(undefined);
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
      <GeoJSONPreview data={geojson} />
    </div>
  );
}
