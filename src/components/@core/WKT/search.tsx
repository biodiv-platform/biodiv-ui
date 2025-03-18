import { Box, Button, Input, Text } from "@chakra-ui/react";
import GeoJSONPreview from "@components/@core/map-preview/geojson";
import SITE_CONFIG from "@configs/site-config";
import AddIcon from "@icons/add";
import { axQueryGeoEntitiesByPlaceName } from "@services/geoentities.service";
import { MENU_PORTAL_TARGET } from "@static/constants";
import { feature } from "@turf/helpers";
import pointOnFeature from "@turf/point-on-feature";
import { getMapCenter } from "@utils/location";
import debounce from "debounce-promise";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import wkt from "wkt";

import { Field } from "@/components/ui/field";

const NakshaGmapsDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaGmapsDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const defaultViewState = getMapCenter(2.8);

const onQuery = async (q) => {
  const { data } = await axQueryGeoEntitiesByPlaceName(q);
  return data.map(({ placeName, wktData, id }) => ({
    geoEntityId: id,
    label: placeName,
    value: wkt.parse(wktData)
  }));
};

export default function WKTSearch({
  labelTitle,
  nameTitle,
  gMapTab,
  nameTopology,
  centroid,
  onSave,
  isDisabled = false,
  mb = 2
}) {
  const [selected, setSelected] = useState<any>();
  const onQueryDebounce = debounce(onQuery, 200);
  const gmapsSearchRef = useRef<any>(null);
  const { t } = useTranslation();

  const handleOnSave = () => {
    if (selected?.label && selected?.value) {
      const { label, value, geoEntityId } = selected;
      onSave({
        geoEntityId,
        [nameTitle]: label,
        [nameTopology]: wkt.stringify(value),
        [centroid]: pointOnFeature(feature(value))
      });
      setSelected(null);
    }
  };

  const handleOnChange = (value) => {
    const label = value?.[0]?.properties?.formatted_address;
    if (label) {
      setSelected({ label, value: value[0] });
      gmapsSearchRef.current.value = "";
    }
  };

  return (
    <Box mb={mb}>
      <div data-hidden={!SITE_CONFIG.DOCUMENT.GEOENTITY_SEARCH}>
        <Field>
          <Field htmlFor="geoentities-search">{labelTitle}</Field>
          <AsyncSelect
            name="geoentities-search"
            id="geoentities-search"
            value={selected}
            menuPortalTarget={MENU_PORTAL_TARGET}
            isSearchable={true}
            isClearable={true}
            noOptionsMessage={() => null}
            onChange={setSelected}
            placeholder={t("form:geoentities")}
            loadOptions={onQueryDebounce}
          />
        </Field>
        {gMapTab && <Text color="gray.500" mb={2} children={t("common:or")} />}
      </div>
      {gMapTab ? (
        <Box position="relative" borderRadius="md" mb={4}>
          <NakshaGmapsDraw
            defaultViewState={defaultViewState}
            defaultFeatures={selected?.value ? [selected?.value] : []}
            isControlled={true}
            isAutocomplete={true}
            isReadOnly={true}
            onFeaturesChange={handleOnChange}
            gmapRegion={SITE_CONFIG.MAP.COUNTRY}
            gmapAccessToken={SITE_CONFIG.TOKENS.GMAP}
            mapStyle={{ height: "22rem", width: "100%", borderRadius: ".25rem" }}
            autocompleteComponent={
              <Field mb={4}>
                <Field htmlFor="gmaps-search">{t("form:find_gmaps")}</Field>
                <Input ref={gmapsSearchRef} w="full" />
                <Field helperText={t("form:coverage.hint")} />
              </Field>
            }
          />
        </Box>
      ) : (
        <Box position="relative" borderRadius="md" mb={2} mt={2}>
          <GeoJSONPreview data={selected?.value || undefined} />
        </Box>
      )}

      <Button
        type="button"
        colorPalette="blue"
        maxW="6rem"
        disabled={isDisabled}
        onClick={handleOnSave}
      >
        <AddIcon />
        {t("common:add")}
      </Button>
    </Box>
  );
}
