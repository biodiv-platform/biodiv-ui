import { Spinner } from "@chakra-ui/react";
import { selectStyles } from "@components/form/configs";
import { axGetUsersByID, axUserFilterSearch } from "@services/user.service";
import { MENU_PORTAL_TARGET } from "@static/constants";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

import useObservationList from "../../use-observation-filter";

export default function UserFilterInput({ filterKey }) {
  const { filter, addFilter, removeFilter } = useObservationList();
  const { t } = useTranslation();
  const [defaultValue, setDefaultValue] = useState<any[]>();

  const onQuery = debounce(axUserFilterSearch, 200);

  useEffect(() => {
    axGetUsersByID(filter?.[filterKey]).then(setDefaultValue);
  }, []);

  const handleOnChange = (value) => {
    if (!value) {
      removeFilter(filterKey);
      return;
    }

    if (Array.isArray(value)) {
      addFilter(filterKey, value.map((v) => v.value).toString());
    } else {
      addFilter(filterKey, value.value);
    }
  };

  return defaultValue ? (
    <AsyncSelect
      name={filterKey}
      inputId={filterKey}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null
      }}
      noOptionsMessage={() => null}
      defaultValue={defaultValue}
      isClearable={true}
      isMulti={false}
      isSearchable={true}
      loadOptions={onQuery}
      menuPortalTarget={MENU_PORTAL_TARGET}
      onChange={handleOnChange}
      placeholder={t("Search by name of user")}
      styles={selectStyles}
      formatOptionLabel={(option) => `${option.label} (${option.value})`}
    />
  ) : (
    <Spinner />
  );
}
