import { Box, FormControl, FormLabel, SimpleGrid } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config.json";
import { axQueryGeoEntitiesByPlaceName } from "@services/geoentities.service";
import { isBrowser } from "@static/constants";
import { getMapCenter } from "@utils/location";
import debounce from "debounce-promise";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import wkt from "wkt";

import SaveButton from "./save-button";

const NakshaGmapsDraw: any = dynamic(
  () => import("naksha-components-react").then((mod: any) => mod.NakshaGmapsDraw),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const defaultViewPort = getMapCenter(2.8);

const onQuery = async (q) => {
  const { data } = await axQueryGeoEntitiesByPlaceName(q);
  return data.map(({ placeName, wktData, id }) => ({
    geoEntityId: id,
    label: placeName,
    value: wkt.parse(wktData)
  }));
};

export default function WKTSearch({ labelTitle, nameTitle, nameTopology, onSave, mb = 4 }) {
  const [selected, setSelected] = useState<any>();
  const onQueryDebounce = debounce(onQuery, 200);

  const handleOnSave = () => {
    if (selected?.label && selected?.value) {
      const { label, value, geoEntityId } = selected;
      onSave({
        geoEntityId,
        [nameTitle]: label,
        [nameTopology]: wkt.stringify(value)
      });
      setSelected(null);
    }
  };

  const handleOnChange = (value) => {
    const label = value?.[0]?.properties?.formatted_address;
    label && setSelected({ label, value: value[0] });
  };

  return (
    <div>
      <SimpleGrid columns={[1, 1, 7, 7]} spacing={4} mb={mb}>
        <FormControl gridColumn="1/7">
          <FormLabel htmlFor={"geoentities-search"}>{labelTitle}</FormLabel>
          <AsyncSelect
            name="geoentities-search"
            id="geoentities-search"
            value={selected}
            menuPortalTarget={isBrowser && document.body}
            isSearchable={true}
            isClearable={true}
            noOptionsMessage={() => null}
            onChange={setSelected}
            placeholder={nameTitle}
            loadOptions={onQueryDebounce}
          />
        </FormControl>
        <SaveButton onClick={handleOnSave} />
      </SimpleGrid>
      <Box position="relative" h="22rem" overflow="hidden" borderRadius="md">
        <NakshaGmapsDraw
          defaultViewPort={defaultViewPort}
          defaultFeatures={selected?.value ? [selected?.value] : []}
          isControlled={true}
          isAutocomplete={true}
          isReadOnly={true}
          onFeaturesChange={handleOnChange}
          gmapRegion={SITE_CONFIG.MAP.COUNTRY}
          gmapApiAccessToken={SITE_CONFIG.TOKENS.GMAP}
        />
      </Box>
    </div>
  );
}
