import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import useUserListFilter from "@components/pages/user/common/use-user-filter";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function TaxonInputField({ translateKey, filterKey }) {
  const { t } = useTranslation();

  const { addFilter, removeFilter } = useUserListFilter();

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        query: Yup.string()
      })
    )
  });

  const onQuery = async (q) => await onScientificNameQuery(q, "name");

  const onChange = async (value, event, setSelected) => {
    if (event.action === "select-option") {
      let o = value[value.length - 1];
      o = { id: o.raw.id };
      addFilter(filterKey, o.id);
    } else {
      removeFilter(filterKey);
    }
    setSelected(value);
  };

  return (
    <FormProvider {...hForm}>
      <SelectAsyncInputField
        name="query"
        onQuery={onQuery}
        optionComponent={ScientificNameOption}
        eventCallback={onChange}
        placeholder={t(translateKey)}
        isClearable={false}
        isCreatable={false}
        multiple={true}
      />
    </FormProvider>
  );
}
