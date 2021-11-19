import { Box, Button, FormControl, FormLabel } from "@chakra-ui/react";
import GeoJSONPreview from "@components/@core/map-preview/geojson";
import SITE_CONFIG from "@configs/site-config";
import AddIcon from "@icons/add";
import { axQueryGeoEntitiesByPlaceName } from "@services/geoentities.service";
import { MENU_PORTAL_TARGET } from "@static/constants";
import { feature } from "@turf/helpers";
import pointOnFeature from "@turf/point-on-feature";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import wkt from "wkt";

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
  nameTopology,
  centroid,
  onSave,
  isDisabled = false,
  mb = 2
}) {
  const [selected, setSelected] = useState<any>();
  const onQueryDebounce = debounce(onQuery, 200);
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

  return (
    <Box mb={mb}>
      <div data-hidden={!SITE_CONFIG.DOCUMENT.GEOENTITY_SEARCH}>
        <FormControl>
          <FormLabel htmlFor="geoentities-search">{labelTitle}</FormLabel>
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
        </FormControl>
      </div>
      <Box position="relative" borderRadius="md" mb={2} mt={2}>
        <GeoJSONPreview data={selected?.value || undefined} />
      </Box>
      <Button
        type="button"
        colorScheme="blue"
        maxW="6rem"
        leftIcon={<AddIcon />}
        isDisabled={isDisabled}
        onClick={handleOnSave}
      >
        {t("common:add")}
      </Button>
    </Box>
  );
}
