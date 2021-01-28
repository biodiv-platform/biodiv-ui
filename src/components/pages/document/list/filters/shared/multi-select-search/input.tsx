import { selectStyles } from "@components/form/configs";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import { axSearchFilterByName } from "@services/esmodule.service";
import { isBrowser } from "@static/constants";
import { DOUCMENT_FILTER_KEY } from "@static/document";
import debounce from "debounce-promise";
import React, { useMemo } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";

export interface FilterMultiSelectProps {
  label?: string;
  translateKey?: string;
  fullTextSearch?: boolean;
  filterKey: string;
  options?;
}

const arrayToOptions = (options) => options && options.map((value) => ({ value, label: value }));

export default function FilterMultiSelectInput({
  label,
  filterKey,
  fullTextSearch = true,
  options
}: FilterMultiSelectProps) {
  const { filter, addFilter, removeFilter } = useDocumentFilter();

  const S = options?.length ? Select : AsyncSelect;

  const searchKey = DOUCMENT_FILTER_KEY[filterKey]?.searchKey || filterKey;

  const onQuery = debounce((q) => axSearchFilterByName(q, searchKey, "ed"), 200);

  const defaultValue = useMemo(
    () => (filter?.[filterKey] ? arrayToOptions(filter?.[filterKey]?.split(",")) : []),
    []
  );

  const handleOnChange = (values) => {
    if (values?.length > 0) {
      addFilter(
        filterKey,
        values.map((item) => (fullTextSearch ? item.value : item.text)).toString()
      );
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
      menuPortalTarget={isBrowser && document.body}
      onChange={handleOnChange}
      options={arrayToOptions(options)}
      placeholder={label}
      styles={selectStyles}
    />
  );
}

FilterMultiSelectInput.whyDidYouRender = true;
