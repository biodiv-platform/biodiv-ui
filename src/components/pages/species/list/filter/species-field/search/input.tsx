import { IconButton } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuSearch } from "react-icons/lu";
import * as Yup from "yup";

import useSpeciesList from "../../../use-species-list";

const TextFilterForm = styled.form`
  display: flex;
  > div {
    flex-grow: 1;
  }
  > button {
    flex-shrink: 0;
    margin-left: 0.75rem;
  }
`;

export default function TextFilterInput({ filterKey, path, label, mb = 0 }) {
  const { filter, pushSpeciesFieldFilter, popSpeciesFieldFilter } = useSpeciesList();
  const defaultValue = filter?.[filterKey];

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        query: Yup.string()
      })
    ),
    defaultValues: { query: defaultValue }
  });

  const handleOnChange = (v) => {
    if (v.query) {
      pushSpeciesFieldFilter(filterKey, `${path}.${v.query}`);
    } else {
      popSpeciesFieldFilter(filterKey, path);
    }
  };

  return (
    <FormProvider {...hForm}>
      <TextFilterForm onSubmit={hForm.handleSubmit(handleOnChange)}>
        <TextBoxField name="query" id={filterKey} label={label} showLabel={false} mb={mb} />
        <IconButton variant="solid" colorPalette="blue" type="submit" aria-label={`Find ${label}`}>
          <LuSearch />
        </IconButton>
      </TextFilterForm>
    </FormProvider>
  );
}
