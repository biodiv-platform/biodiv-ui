import { selectStyles } from "@components/form/configs";
import { ClearIndicator } from "@components/form/configs";
import { axSearchFilterByName } from "@services/esmodule.service";
import { MENU_PORTAL_TARGET } from "@static/constants";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import Select, { components } from "react-select";
import AsyncSelect from "react-select/async";

export interface FilterMultiSelectProps {
  label?: string;
  filterKeyList;
  useIndexFilter;
  translateKey?: string;
  filterKey: string;
  searchQuery?: (q: any) => Promise<any[] | undefined>;
  optionsComponent?: ({ children, ...props }: any) => JSX.Element;
  isMulti?: boolean;
  options?;
}

const DefaultOptionComponent = (p: any) => <components.Option {...p} />;

const arrayToOptions = (options) => options && options.map((value) => ({ value, label: value }));

export default function FilterMultiSelectInput({
  label,
  filterKeyList,
  useIndexFilter,
  filterKey,
  isMulti,
  searchQuery,
  optionsComponent,
  options
}: FilterMultiSelectProps) {
  const { t } = useTranslation();

  const { filter, addFilter, removeFilter } = useIndexFilter();

  const S: any = options?.length ? Select : AsyncSelect;

  const searchKey = filterKeyList[filterKey].searchKey || filterKey;

  const onQuery = debounce(
    (q) => axSearchFilterByName(q, searchKey, filterKeyList.index, true),
    200
  );

  const defaultValue = useMemo(
    () => (filter?.[filterKey] ? arrayToOptions(filter?.[filterKey]?.split(",")) : []),
    []
  );

  const handleOnChange = (values) => {
    if (values?.label) {
      addFilter(filterKey, values.label);
    } else {
      removeFilter(filterKey);
    }
  };

  return (
    <S
      name={filterKey}
      inputId={filterKey}
      noOptionsMessage={() => null}
      defaultValue={defaultValue}
      isClearable={true}
      isMulti={isMulti}
      isSearchable={true}
      loadOptions={searchQuery || onQuery}
      menuPortalTarget={MENU_PORTAL_TARGET}
      onChange={handleOnChange}
      components={{
        Option: optionsComponent || DefaultOptionComponent,
        ClearIndicator,
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null
      }}
      options={arrayToOptions(options)}
      placeholder={label || t("form:min_three_chars")}
      styles={selectStyles}
    />
  );
}

FilterMultiSelectInput.whyDidYouRender = true;
