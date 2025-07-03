import { Box, HStack, Input, SimpleGrid } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import SITE_CONFIG from "@configs/site-config";
import DeleteIcon from "@icons/delete";
import { axQueryGeoEntitiesByPlaceName } from "@services/geoentities.service";
import center from "@turf/center";
import { feature } from "@turf/helpers";
import { getMapCenter } from "@utils/location";
import notification from "@utils/notification";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import wkt from "wkt";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

import GeoJSONPreview from "../map-preview/geojson";
import SaveButton from "./save-button";

const NakshaMapboxDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaMapboxDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const onQuery = async (q) => {
  const { data } = await axQueryGeoEntitiesByPlaceName(q);
  return data.map(({ placeName, wktData, id }) => ({
    geoEntityId: id,
    label: placeName,
    value: wkt.parse(wktData)
  }));
};

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
  isMultiple?: boolean;
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
  const defaultViewState = React.useMemo(() => getMapCenter(2), []);
  const { t } = useTranslation();
  const [geojson, setGeojson] = useState<any>();

  const handleOnSave = () => {
    if (TitleInputRef.current.value && geojson) {
      onSave({
        [nameTitle]: TitleInputRef.current.value,
        [nameTopology]: wkt.stringify(geojson),
        [centroid]: center(feature(geojson))
      });

      // Reset Fields
      TitleInputRef.current.clearValue();
      WKTInputRef.current.value = "";
    } else {
      notification("Valid PlaceName and WKT both are required");
    }
  };

  const onWKTInputChange = () => {
    try {
      setGeojson(wkt.parse(WKTInputRef.current.value));
    } catch (e) {
      setGeojson(undefined);
      WKTInputRef.current.value = "";
      console.error(e);
    }
  };

  const clearWktForm = () => {
    TitleInputRef.current.clearValue();
    WKTInputRef.current.value = "";
  };

  const handleMapDraw = (geoJson) => {
    if (geoJson.length > 0) {
      WKTInputRef.current.value = wkt.stringify(geoJson[0]);
      setGeojson(wkt.parse(WKTInputRef.current.value));
    } else {
      WKTInputRef.current.value = "";
    }
  };

  const handleEventCallback = async (res, event, setSelected) => {
    switch (event?.action) {
      case "clear":
        WKTInputRef.current.value = "";
        setSelected();
        setGeojson(undefined);
        break;
      default:
        if (res?.geoEntityId) {
          WKTInputRef.current.value = wkt.stringify(res.value);
          setGeojson(wkt.parse(WKTInputRef.current.value));
        }
        TitleInputRef.current.value = res.label;
        setSelected(res);
        break;
    }
  };

  useEffect(() => {
    if (!disabled) {
      WKTInputRef.current.value = "";
      TitleInputRef.current.clearValue();
      setGeojson(undefined);
    }
  }, [disabled]);

  return (
    <div>
      <SimpleGrid columns={[1, 1, 5, 5]} alignItems="flex-end" gap={3} mb={mb}>
        <Field gridColumn="1/3" >
          <SelectAsyncInputField
            name="geoentities-search"
            placeholder={t("form:geoentities")}
            onQuery={onQuery}
            eventCallback={handleEventCallback}
            isClearable={true}
            disabled={disabled}
            mb={0}
            label={labelTitle}
            selectRef={TitleInputRef}
          />
        </Field>
        <Field gridColumn="3/5">
          <Field htmlFor={nameTopology} label={labelTopology} />
          <HStack gap="10" width="full">
            <InputGroup width={"full"}>
              <Input
                name={nameTopology}
                id={nameTopology}
                ref={WKTInputRef}
                placeholder={labelTopology}
                onChange={onWKTInputChange}
                disabled={disabled}
              />
            </InputGroup>

            {geojson && (
              <InputGroup flex="1">
                <Input ps="4.75em">
                  <IconButton
                    className="left"
                    aria-label={t("common:clear")}
                    color="red.300"
                    colorPalette="red.300"
                    onClick={clearWktForm}
                    disabled={disabled}
                  />
                  <DeleteIcon />
                </Input>
              </InputGroup>
            )}
          </HStack>
        </Field>
        <SaveButton disabled={disabled} onClick={handleOnSave} />
      </SimpleGrid>
      {geojson ? (
        <GeoJSONPreview data={geojson} />
      ) : (
        <Box position="relative" h="22rem">
          <NakshaMapboxDraw
            defaultViewState={defaultViewState}
            mapboxAccessToken={SITE_CONFIG.TOKENS.MAPBOX}
            onFeaturesChange={handleMapDraw}
            isReadOnly={disabled}
          />
        </Box>
      )}
    </div>
  );
}
