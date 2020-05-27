import {
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  IconButton
} from "@chakra-ui/core";
import TextInput from "@components/form/text";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import useObservationFilter from "@hooks/useObservationFilter";
import React from "react";
import { useForm } from "react-hook-form";
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

export default function TextFilterPanel({ filterKey, translateKey }) {
  const { filter, addFilter, removeFilter } = useObservationFilter();
  const defaultValue = filter?.[filterKey];
  const { t } = useTranslation();
  const title = t(translateKey + "TITLE");

  const hForm = useForm({
    validationSchema: Yup.object().shape({
      query: Yup.string()
    }),
    defaultValues: { query: defaultValue }
  });

  const handleOnChange = (v) => {
    v.query ? addFilter(filterKey, v.query) : removeFilter(filterKey);
  };

  return (
    <AccordionItem>
      <AccordionHeader>
        <div>{title}</div>
        <AccordionIcon />
      </AccordionHeader>
      <AccordionPanel>
        <TextFilterForm onSubmit={hForm.handleSubmit(handleOnChange)}>
          <TextInput name="query" form={hForm} label={title} showLabel={false} mb={0} />
          <IconButton
            variant="solid"
            variantColor="blue"
            type="submit"
            icon="search"
            aria-label={`Find ${title}`}
          />
        </TextFilterForm>
      </AccordionPanel>
    </AccordionItem>
  );
}
