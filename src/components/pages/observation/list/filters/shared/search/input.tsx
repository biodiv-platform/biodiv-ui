import { IconButton } from "@chakra-ui/core";
import TextInput from "@components/form/text";
import styled from "@emotion/styled";
import useObservationFilter from "@hooks/useObservationFilter";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as Yup from "yup";

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

export default function TextFilterInput({ filterKey, label, mb = 0 }) {
  const { filter, addFilter, removeFilter } = useObservationFilter();
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
    v.query ? addFilter(filterKey, v.query) : removeFilter(filterKey);
  };

  return (
    <TextFilterForm onSubmit={hForm.handleSubmit(handleOnChange)}>
      <TextInput name="query" id={filterKey} form={hForm} label={label} showLabel={false} mb={mb} />
      <IconButton
        variant="solid"
        variantColor="blue"
        type="submit"
        icon="search"
        aria-label={`Find ${label}`}
      />
    </TextFilterForm>
  );
}
