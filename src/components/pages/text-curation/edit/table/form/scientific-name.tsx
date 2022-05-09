import { Box, Button } from "@chakra-ui/react";
import { Tag } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import TaxonBreadcrumbs from "@components/pages/common/breadcrumbs";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import useTranslation from "next-translate/useTranslation";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function ScientificNameEdit({ row }) {
  const { t } = useTranslation();
  const hForm = useFormContext();
  const scientificRef: any = useRef(null);

  const initialBreadCrumbs = row.hierarchy.map((v) => ({
    id: v.taxon_id,
    name: v.taxon_name,
    rankName: v.taxon_rank
  }));

  const [breadCrumbs, setBreadCrumbs] = useState<any[]>();

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
      <TaxonBreadcrumbs
        crumbs={breadCrumbs ? breadCrumbs : initialBreadCrumbs}
        type="observation"
      />
      <Tag mb={3}>
        {breadCrumbs
          ? `taxon id : ${breadCrumbs[breadCrumbs.length - 1].id}`
          : row.taxonId
          ? `taxon id : ${row.taxonId}`
          : `taxon id : None`}
      </Tag>

      <Tag mb={3}>
        {breadCrumbs
          ? `rank : ${breadCrumbs[breadCrumbs.length - 1].rankName}`
          : row.rank
          ? `rank : ${row.rank}`
          : `rank : None`}
      </Tag>
      <br />
      {row.taxonomyMatchedNames.map((suggestion) => (
        <Button
          variant="outline"
          size="xs"
          bg="blue.50"
          key={suggestion}
          colorScheme="blue"
          borderRadius="3xl"
          onClick={() => onTagSelect(suggestion)}
          mb={2}
          mr={2}
        >
          {suggestion.fullName}
        </Button>
      ))}
    </Box>
  );
}
