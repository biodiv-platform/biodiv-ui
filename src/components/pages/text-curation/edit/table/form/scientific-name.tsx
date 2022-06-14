import { Box, Button, HStack, Tag } from "@chakra-ui/react";
import { RadioInputField } from "@components/form/radio";
import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import { nanoid } from "nanoid";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import CurationTaxonBreadcrumbs from "./curation-breadcrumbs";

const validityOptions = ["Not validated", "Validated", "Invalid"];
const options = validityOptions.map((v) => ({ label: v, value: v }));

export default function ScientificNameEdit({ row }) {
  const { t } = useTranslation();
  const hForm = useFormContext();
  const scientificRef: any = useRef(null);

  const initialBreadCrumbs = row.hierarchy.map((v) => ({
    id: v.taxon_id,
    name: v.taxon_name,
    rankName: v.taxon_rank
  }));

  const [breadCrumbs, setBreadCrumbs] = useState<any[]>([]);

  const onSciNameQuery = async (q) => await onScientificNameQuery(q, "name");

  const onTagSelect = (value) => {
    setBreadCrumbs(
      value.hierarchy.map((v) => ({
        id: v.taxon_id,
        name: v.taxon_name,
        rankName: v.taxon_rank
      }))
    );
    scientificRef.current.onChange(
      {
        value: value.fullName,
        label: value.fullName,
        taxonId: value.taxonId,
        rank: value.rank,
        hierarchy: value.hierarchy
      },
      { name: scientificRef.current.props.inputId }
    );
  };

  const handleOnChange = (value) => {
    setBreadCrumbs(
      value.hierarchy
        ? value.hierarchy.map((v) => ({
            id: v.taxon_id,
            name: v.taxon_name,
            rankName: v.taxon_rank
          }))
        : initialBreadCrumbs
    );
    hForm.setValue("taxonId", value.taxonId ? value.taxonId : row.taxonId);
    hForm.setValue("rank", value.rank ? value.rank : row.rank);
    hForm.setValue("hierarchy", value.hierarchy ? value.hierarchy : row.hierarchy);
  };

  return (
    <Box p={4} pb={0} mb={6}>
      {row.taxonomyMatchedNames.map((suggestion) => (
        <Button
          variant="outline"
          size="xs"
          bg="blue.50"
          key={nanoid()}
          colorScheme="blue"
          borderRadius="3xl"
          onClick={() => onTagSelect(suggestion)}
          mb={2}
          mr={2}
        >
          {suggestion.fullName}
        </Button>
      ))}
      <SelectAsyncInputField
        resetOnSubmit={false}
        name="curatedSName"
        label={t("text-curation:curated.sci_name")}
        placeholder={t("observation:scientific_name")}
        onQuery={onSciNameQuery}
        onChange={handleOnChange}
        optionComponent={ScientificNameOption}
        selectRef={scientificRef}
        isRaw={true}
        mb={3}
      />
      {breadCrumbs.length > 0 ? (
        <CurationTaxonBreadcrumbs
          crumbs={breadCrumbs ? breadCrumbs : initialBreadCrumbs}
        ></CurationTaxonBreadcrumbs>
      ) : (
        initialBreadCrumbs.length > 0 && (
          <CurationTaxonBreadcrumbs crumbs={initialBreadCrumbs}></CurationTaxonBreadcrumbs>
        )
      )}

      <Box mb={4}>
        <HStack spacing={4}>
          {breadCrumbs.length > 0 ? (
            <Tag>
              {t("text-curation:edit.scientific_name.taxon_id")} :
              {breadCrumbs[breadCrumbs.length - 1].id}
            </Tag>
          ) : (
            row.taxonId && (
              <Tag>
                {t("text-curation:edit.scientific_name.taxon_id")} : {row.taxonId}
              </Tag>
            )
          )}

          {breadCrumbs.length > 0 ? (
            <Tag>
              {t("text-curation:edit.scientific_name.rank")} :
              {breadCrumbs[breadCrumbs.length - 1].rankName}
            </Tag>
          ) : (
            row.rank && (
              <Tag>
                {t("text-curation:edit.scientific_name.rank")} : {row.rank}
              </Tag>
            )
          )}
        </HStack>
      </Box>

      <RadioInputField
        name="validatedStatus"
        label={t("text-curation:edit.scientific_name.validity")}
        options={options}
        mb={4}
        isInline={false}
      />
    </Box>
  );
}
