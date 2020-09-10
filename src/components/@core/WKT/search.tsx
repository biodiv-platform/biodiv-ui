import { FormControl, FormLabel, SimpleGrid } from "@chakra-ui/core";
import { axQueryGeoEntitiesByPlaceName } from "@services/geoentities.service";
import { isBrowser } from "@static/constants";
import debounce from "debounce-promise";
import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import wkt from "wkt";

import GeoJSONPreview from "../map-preview/geojson";
import SaveButton from "./save-button";

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
      <GeoJSONPreview data={selected?.value} />
    </div>
  );
}
