import { Box, IconButton } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { axGetTaxonList, doTaxonSearch } from "@services/api.service";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuSearch } from "react-icons/lu";
import * as Yup from "yup";

import { mergeDeep } from "./taxon-browser-helpers";

const SearchForm = styled.form`
  display: flex;
  margin-bottom: 0.75rem;
  > div {
    flex-grow: 1;
    margin: 0;
  }
  > button {
    flex-shrink: 0;
    margin-left: 0.75rem;
  }
`;

const onQuery = (q) => onScientificNameQuery(q, "name");

export default function TaxonSuggest({ setParentState, parentState }) {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        query: Yup.string()
      })
    )
  });

  const handleOnSearch = async (values) => {
    setIsLoading(true);
    const selectedKeys = await doTaxonSearch(values.query);
    if (!selectedKeys.length) {
      setIsLoading(false);
      return;
    }

    const treeData = await axGetTaxonList({
      expand_taxon: true,
      taxonIds: selectedKeys.toString()
    });

    if (!treeData.length) {
      setIsLoading(false);
      return;
    }

    const expandedKeys = Array.from(
      new Set([...parentState.expandedKeys, ...(treeData?.[0]?.ids || [])])
    );

    setParentState({
      selectedKeys,
      treeData: mergeDeep(parentState.treeData, treeData),
      expandedKeys,
      resultsCount: selectedKeys.length
    });
    setIsLoading(false);
  };

  return (
    <Box pl={4} pr={4}>
      <FormProvider {...hForm}>
        <SearchForm onSubmit={hForm.handleSubmit(handleOnSearch)}>
          <SelectAsyncInputField
            name="query"
            onQuery={onQuery}
            optionComponent={ScientificNameOption}
            placeholder={t("filters:taxon_browser.search")}
            resetOnSubmit={false}
          />
          <IconButton
            variant="solid"
            colorPalette="blue"
            loading={isLoading}
            type="submit"
            aria-label={t("filters:taxon_browser.search")}
          >
            <LuSearch />
          </IconButton>
        </SearchForm>
      </FormProvider>
    </Box>
  );
}
