import { SearchIcon } from "@chakra-ui/icons";
import { GridItem, Heading, SimpleGrid } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import { axCheckTaxonomy } from "@services/species.service";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import useSpeciesCreate from "./species-taxon-suggestions/create/use-species-create";

export function SpeciesValidateForm() {
  const { t } = useTranslation();
  const {
    setValidateResponse,
    setSelectedTaxon,
    taxonRanksMeta,
    setValidationParams,
    setIsLoading
  } = useSpeciesCreate();

  const taxonRankOptions = taxonRanksMeta.map((rank) => ({ label: rank.name, value: rank.name }));

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        rank: Yup.string().required(),
        speciesName: Yup.string().required()
      })
    ),
    defaultValues: {
      rank: taxonRankOptions[1]?.value
    }
  });

  const handleOnValidate = async (values) => {
    setIsLoading(true);
    const { success, data } = await axCheckTaxonomy(values);
    if (success) {
      setValidateResponse(data);
      setSelectedTaxon(undefined);
      setValidationParams(values);
    } else {
      notification(t("species:create.validate_error"));
    }
    setIsLoading(false);
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnValidate)}>
        <Heading mb={4} fontSize="2xl">
          🔍 {t("species:create.form.search")}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 6 }} spacing={{ md: 4 }} mb={2}>
          <GridItem colSpan={1}>
            <SelectInputField
              name="rank"
              label={t("species:create.form.rank")}
              options={taxonRankOptions}
              isRequired={true}
            />
          </GridItem>
          <GridItem colSpan={4}>
            <TextBoxField
              name="speciesName"
              label={t("species:create.form.name")}
              hint={t("species:create.form.name_placeholder")}
              isRequired={true}
            />
          </GridItem>
          <SubmitButton mt={{ md: "31px" }} leftIcon={<SearchIcon />}>
            {t("species:create.form.validate")}
          </SubmitButton>
        </SimpleGrid>
      </form>
    </FormProvider>
  );
}
