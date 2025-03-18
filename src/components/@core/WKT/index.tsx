import { Input, SimpleGrid } from "@chakra-ui/react";
import center from "@turf/center";
import { feature } from "@turf/helpers";
import notification from "@utils/notification";
import React, { useRef, useState } from "react";
import wkt from "wkt";

import { Field } from "@/components/ui/field";

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
      <SimpleGrid columns={[1, 1, 7, 7]} gap={4} mb={mb}>
        <Field gridColumn="1/4">
          <Field htmlFor={nameTitle}>{labelTitle}</Field>
          <Input
            id={nameTitle}
            ref={TitleInputRef}
            name={nameTitle}
            placeholder={labelTitle}
            disabled={disabled}
          />
        </Field>
        <Field gridColumn="4/7">
          <Field htmlFor={nameTopology}>{labelTopology}</Field>
          <Input
            name={nameTopology}
            id={nameTopology}
            ref={WKTInputRef}
            placeholder={labelTopology}
            onChange={onWKTInputChange}
            disabled={disabled}
          />
        </Field>
        <SaveButton disabled={disabled} onClick={handleOnSave} />
      </SimpleGrid>
      <GeoJSONPreview data={geojson} />
    </div>
  );
}
