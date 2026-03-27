import { Box, Circle, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import { axCheckTaxonomy, axSaveTaxonomy } from "@services/taxonomy.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuCheck, LuTriangleAlert } from "react-icons/lu";
import * as Yup from "yup";

import { Alert } from "@/components/ui/alert";

import { TaxonCreateInputField } from "./taxon-create-input";
import TaxonCreateModal from "./taxon-create-modal";
import useSpeciesCreate from "./use-species-create";

export function SpeciesTaxonCreateForm() {
  const { taxonRanksMeta, validationParams, setSelectedTaxon } = useSpeciesCreate();
  const { t } = useTranslation();
  const [validateResults, setValidateResults] = useState([]);
  const { open, onClose, onOpen } = useDisclosure();
  const [disableForm, setDisableForm] = useState<boolean>();
  const [fieldHints, setFieldHints] = useState<Record<string, string>>({});

  const [formValidationSchema, formDisabled] = useMemo(() => {
    const validation: [string, any][] = [];
    const disabled: [string, boolean, boolean][] = [];

    let found = false;

    taxonRanksMeta.forEach(({ name, isRequired }) => {
      // Push Yup Schema
      const required = isRequired ? found : false;
      validation.push([name, required ? Yup.string().required() : Yup.string().notRequired()]);

      // Push to Disabled
      disabled.push([name, required, !found]);

      // check for match
      if (validationParams.rankName === name) {
        found = true;
      }
    });

    return [Object.fromEntries(validation), disabled];
  }, [validationParams]);

  const hForm = useForm<any>({
    resolver: yupResolver(Yup.object().shape(formValidationSchema)),
    defaultValues: { [validationParams.rankName]: validationParams.scientificName }
  });

  const handleOnTaxonCreate = async (values) => {
    if (
      (validationParams.rankName == "species" || validationParams.rankName == "infraspecies") &&
      validationParams.scientificName.split(" ")[0] != values.genus
    ) {
      notification(
        "Couldn't submit as the generic name does not correspond to the genus assigned to this taxon.",
        NotificationType.Error
      );
      return;
    }
    const { metadata, ...valuesWithMetdata } = values;
    const { success, data } = await axSaveTaxonomy({
      scientificName: validationParams.scientificName,
      rank: validationParams.rankName,
      rankToName: Object.fromEntries(Object.entries(valuesWithMetdata).filter((o) => o[1])),
      status: "ACCEPTED",
      position: "RAW"
    });
    if (success) {
      setSelectedTaxon(data);
      setDisableForm(true);
    } else {
      notification(t("species:create.taxon_error"));
    }
  };

  const handleOnRankValidate = async (rankName, scientificName) => {
    // clear results
    setValidateResults([]);

    const { success, data } = await axCheckTaxonomy({ rankName, scientificName });

    if (success) {
      // clear error for current field since no match should also be treated as valid
      hForm.clearErrors(rankName);

      // if results are available show select dialouge
      if (data.matched) {
        setValidateResults(data.matched);
        if (fieldHints[rankName]) {
          setFieldHints((prev) => {
            const newHints = { ...prev };
            delete newHints[rankName];
            return newHints;
          });
        }
        onOpen();
      } else {
        // Set a warning (not an error) - won't block form submission
        /*hForm.setError(rankName, {
          type: "hint",
          message: "No match found"
        });*/
        setFieldHints((prev) => ({
          ...prev,
          [rankName]: "No match found. Name will be created while updating"
        }));
      }
    } else {
      notification(t("species:create.validate_error"));
    }
  };

  return disableForm ? (
    <Alert status="info">{t("species:create.creating_page")}</Alert>
  ) : (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnTaxonCreate)}>
        <TaxonCreateModal isOpen={open} onClose={onClose} validateResults={validateResults} />
        {formDisabled.map(([name, isRequired, isDisabled]) => (
          <TaxonCreateInputField
            key={name}
            name={name}
            label={name}
            isDisabled={isDisabled}
            onValidate={handleOnRankValidate}
            isRequired={isRequired}
            hint={fieldHints[name]}
          />
        ))}
        <Box p={2} lineHeight={1} mb={4}>
          <HStack gap={7} mb={4}>
            <Box display="flex" alignItems="center" gap={2} justifyContent={"center"}>
              <Circle size="15px" bg="var(--chakra-colors-gray-300)" />
              Raw
            </Box>
            <Box display="flex" alignItems="center" gap={2} justifyContent={"center"}>
              <Circle size="15px" bg="var(--chakra-colors-yellow-300)" />
              Working
            </Box>
            <Box display="flex" alignItems="center" gap={2} justifyContent={"center"}>
              <Circle size="15px" bg="var(--chakra-colors-green-300)" />
              Clean
            </Box>
          </HStack>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Icon as={LuCheck} color="green.500" />
            Name match found and validated
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Icon as={LuTriangleAlert} color="red.500" />
            No match found. Name will be created
          </Box>
        </Box>
        <SubmitButton isDisabled={Object.keys(hForm.formState.errors).length}>
          {t("species:create.form.taxon.create")}
        </SubmitButton>
      </form>
    </FormProvider>
  );
}
