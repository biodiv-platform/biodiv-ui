import { Alert, AlertIcon } from "@chakra-ui/alert";
import { useDisclosure } from "@chakra-ui/hooks";
import SubmitButton from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import { axCheckTaxonomy, axSaveTaxonomy } from "@services/species.service";
import notification from "@utils/notification";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { TaxonCreateInputField } from "./taxon-create-input";
import TaxonCreateModal from "./taxon-create-modal";
import useSpeciesCreate from "./use-species-create";

export function SpeciesTaxonCreateForm() {
  const { taxonRanksMeta, validationParams, setSelectedTaxon } = useSpeciesCreate();
  const { t } = useTranslation();
  const [validateResults, setValidateResults] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [disableForm, setDisableForm] = useState<boolean>();

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
      if (validationParams.rank === name) {
        found = true;
      }
    });

    return [Object.fromEntries(validation), disabled];
  }, [validationParams]);

  const hForm = useForm<any>({
    resolver: yupResolver(Yup.object().shape(formValidationSchema)),
    defaultValues: { [validationParams.rank]: validationParams.speciesName }
  });

  const handleOnTaxonCreate = async (values) => {
    const { success, data } = await axSaveTaxonomy({
      scientificName: validationParams.speciesName,
      rank: validationParams.rank,
      rankToName: values,
      status: "ACCEPTED",
      position: "RAW"
    });
    if (success) {
      setSelectedTaxon(data);
      setDisableForm(true);
    } else {
      notification(t("SPECIES.CREATE.TAXON_ERROR"));
    }
  };

  const handleOnRankValidate = async (rank, speciesName) => {
    // clear results
    setValidateResults([]);

    const { success, data } = await axCheckTaxonomy({ rank, speciesName });

    if (success) {
      // clear error for current field since no match should also be treated as valid
      hForm.clearErrors(rank);

      // if results are available show select dialouge
      if (data.matched) {
        setValidateResults(data.matched);
        onOpen();
      }
    } else {
      notification(t("SPECIES.CREATE.VALIDATE_ERROR"));
    }
  };

  return disableForm ? (
    <Alert status="info">
      <AlertIcon />
      {t("SPECIES.CREATE.CREATING_PAGE")}
    </Alert>
  ) : (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnTaxonCreate)}>
        <TaxonCreateModal isOpen={isOpen} onClose={onClose} validateResults={validateResults} />
        {formDisabled.map(([name, isRequired, isDisabled]) => (
          <TaxonCreateInputField
            key={name}
            name={name}
            label={name}
            isDisabled={isDisabled}
            onValidate={handleOnRankValidate}
            isRequired={isRequired}
          />
        ))}
        <SubmitButton isDisabled={Object.keys(hForm.errors).length} form={hForm}>
          {t("SPECIES.CREATE.FORM.TAXON.CREATE")}
        </SubmitButton>
      </form>
    </FormProvider>
  );
}