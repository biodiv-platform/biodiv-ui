import { selectStyles } from "@components/form/configs";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { axSearchFilterByName } from "@services/esmodule.service";
import { MENU_PORTAL_TARGET } from "@static/constants";
import debounce from "debounce-promise";
import React, { useMemo } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";

export interface FilterMultiSelectProps {
  label?: string;
  translateKey?: string;
  filterKey: string;
  options?;
}

const arrayToOptions = (options) => options && options.map((value) => ({ value, label: value }));

export default function FilterMultiSelectInput({
  label,
  filterKey,
  options
}: FilterMultiSelectProps) {
  const { filter, addFilter, removeFilter } = useObservationFilter();

  const S: any = options?.length ? Select : AsyncSelect;

  const onQuery = debounce((q) => axSearchFilterByName(q, filterKey), 200);

  const defaultValue = useMemo(
    () => (filter?.[filterKey] ? arrayToOptions(filter?.[filterKey]?.split(",")) : []),
    []
  );

  const handleOnChange = (values) => {
    if (values?.length > 0) {
      addFilter(filterKey, values.map(({ value }) => value).toString());
    } else {
      removeFilter(filterKey);
    }
  };

  return (
    <S
      name={filterKey}
      inputId={filterKey}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null
      }}
      noOptionsMessage={() => null}
      defaultValue={defaultValue}
      isClearable={true}
      isMulti={true}
      isSearchable={true}
      loadOptions={onQuery}
      menuPortalTarget={MENU_PORTAL_TARGET}
      onChange={handleOnChange}
      options={arrayToOptions(options)}
      placeholder={label}
      styles={selectStyles}
    />
  );
}

FilterMultiSelectInput.whyDidYouRender = true;
