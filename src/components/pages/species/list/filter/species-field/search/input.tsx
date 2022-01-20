import { SearchIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
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
  const { filter, addFilter, removeFilter } = useSpeciesList();
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
      addFilter(filterKey, v.query);
      addFilter("path", path);
    } else {
      removeFilter(filterKey);
      removeFilter("path");
    }
  };

  return (
    <FormProvider {...hForm}>
      <TextFilterForm onSubmit={hForm.handleSubmit(handleOnChange)}>
        <TextBoxField name="query" id={filterKey} label={label} showLabel={false} mb={mb} />
        <IconButton
          variant="solid"
          colorScheme="blue"
          type="submit"
          icon={<SearchIcon />}
          aria-label={`Find ${label}`}
        />
      </TextFilterForm>
    </FormProvider>
  );
}
