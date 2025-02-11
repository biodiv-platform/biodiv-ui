import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Textarea
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import { yupResolver } from "@hookform/resolvers/yup";
import { Role } from "@interfaces/custom";
import { axUploadResource } from "@services/files.service";
import { axCreateTrait } from "@services/traits.service";
import { hasAccess } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import Error from "../../_error";
import TraitsValueComponent from "./trait-value-component";

const onQuery = (q) => onScientificNameQuery(q, "name");

interface TraitValue {
  description: string;
  value: string;
  file: File | null;
}

interface Trait {
  name: string;
  description: string;
  category: string;
  isObservation: boolean;
  Paritcipatory: boolean;
  type: string;
  dataType: string;
  values: TraitValue[];
  generalFile: File | null; // Define values as an array of strings
  source: string;
  speciesField: string | undefined;
  units: string | undefined;
  min: number | undefined;
  max: number | undefined;
  minDate: string | undefined;
  maxDate: string | undefined;
}

export default function TraitsCreateComponent({ speciesField }) {
  const { t } = useTranslation();
  const speciesCategoryField = speciesField.speciesField
    .filter((item) => item.childFields.length == 0)
    .map((item) => item.parentField);
  const speciesSubCategoryField = speciesField.speciesField
    .filter((item) => item.childFields.length != 0)
    .map((item) => item.childFields)
    .flat();
  const router = useLocalRouter();

  const [canSubmit, setCanSubmit] = useState<boolean>();

  useEffect(() => {
    setCanSubmit(hasAccess([Role.Admin]));
  }, []);

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        query: Yup.string()
      })
    )
  });

  // Dropzone setup, with a single file restriction
  const handleGeneralDrop = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setTrait((prevTrait) => ({
          ...prevTrait,
          generalFile: file
        }));
      }
    }
  });

  const [trait, setTrait] = useState<Trait>({
    name: Array.isArray(router?.query?.name)
      ? router.query.name[0] ?? ""
      : router?.query?.name ?? "",
    description: "",
    category: "",
    isObservation: false,
    Paritcipatory: false,
    type: "",
    dataType: Array.isArray(router?.query?.name)
      ? router.query.name[0]?.split("(")?.[1]
        ? "NUMERIC"
        : router.query.name[0] ?? ""
      : router?.query?.name?.split("(")?.[1]
      ? "NUMERIC"
      : router.query.name?.split("(")?.[0] ?? "",
    values: [
      {
        description: "",
        value: "",
        file: null
      }
    ],
    generalFile: null,
    source: "",
    speciesField: undefined,
    units: Array.isArray(router?.query?.name)
      ? router.query.name[0]?.split("(")?.[1]
        ? router.query.name[0]?.split("(")?.[1]?.slice(0, -1) ?? undefined
        : router.query.name[0] ?? undefined
      : router?.query?.name?.split("(")?.[1]
      ? router.query.name?.split("(")?.[1]?.slice(0, -1) ?? undefined
      : router.query.name?.split("(")?.[0] ?? undefined,
    min: undefined,
    max: undefined,
    minDate: undefined,
    maxDate: undefined
  });

  async function handleSubmit(event) {
    event.preventDefault();
    let taxonIds = "";
    if (hForm.getValues("query") != null) {
      taxonIds = hForm
        .getValues("query")
        .map((taxon) => `${taxon.taxonId}`)
        .join("|");
    }
    // Use Promise.all to wait for all uploads to complete before creating the trait
    const valueStringArray = await Promise.all(
      trait.values.map(async (value) => {
        if (value.file != null) {
          const { success, data } = await axUploadResource(value.file, "traits", undefined);
          if (success) {
            return `${value.description}:${value.value}:${data}`;
          }
        }
        // Return a default formatted string if no file or upload fails
        else {
          return `${value.description}:${value.value}`;
        }
      })
    );

    // Join all parts into a single string
    const valueString = valueStringArray.join("|");

    const params = {
      dataType: trait.dataType,
      description: trait.description,
      name: trait.name,
      traitTypes: trait.type,
      showInObservation: trait.isObservation,
      isParticipatory: trait.Paritcipatory,
      values: valueString,
      taxonIds: taxonIds,
      icon: null,
      units: trait.units,
      speciesField: trait.speciesField,
      source: trait.source
    };

    if (trait.dataType == "NUMERIC") {
      if (trait.min != undefined) {
        params["min"] = trait.min;
      }
      if (trait.max != undefined) {
        params["max"] = trait.max;
      }
    }
    if (trait.generalFile != null) {
      const { success, data } = await axUploadResource(trait.generalFile, "traits", undefined);
      if (success) {
        params.icon = data;
      }
    }
    const { success, data } = await axCreateTrait(params);
    if (success) {
      notification("Trait Created", NotificationType.Success);
      router.push(`/traits/show/${data}`, true);
    } else {
      notification("Unable to create");
    }
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrait((prevTrait) => ({
      ...prevTrait,
      [name]: type === "checkbox" ? checked : value
    }));
    if (name == "dataType") {
      if (value == "COLOR") {
        setTrait((prevTrait) => ({
          ...prevTrait,
          type: "MULTIPLE_CATEGORICAL"
        }));
      }
      if (value == "DATE") {
        setTrait((prevTrait) => ({
          ...prevTrait,
          type: "RANGE"
        }));
      }
      if (value == "NUMERIC") {
        setTrait((prevTrait) => ({
          ...prevTrait,
          type: "RANGE"
        }));
      }
    }
  };

  const handleValueChange = (index, updatedValueObj) => {
    setTrait((prevTrait) => {
      const updatedValues = [...prevTrait.values];
      updatedValues[index] = updatedValueObj;
      return { ...prevTrait, values: updatedValues };
    });
  };

  function handleAddValue() {
    setTrait((prevTrait) => ({
      ...prevTrait,
      values: prevTrait.values.concat({ description: "", value: "", file: null }) // Append an empty string for a new input
    }));
  }

  const removeValue = (index) => {
    setTrait((prevTrait) => ({
      ...prevTrait,
      values: prevTrait.values.filter((_, i) => i !== index)
    }));
  };

  return canSubmit ? (
    <div className="container mt">
      <PageHeading>{t("traits:create_form.heading")}</PageHeading>
      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Box>
            <FormControl>
              <FormLabel htmlFor="name">{t("traits:create_form.trait_name")}</FormLabel>
              <Input
                type="text"
                id="name"
                name="name"
                value={trait.name}
                onChange={handleChange}
                placeholder={t("traits:create_form.trait_name_placeholder")}
                required
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel htmlFor="dataType">{t("traits:create_form.data_type")}</FormLabel>
              <Select
                id="dataType"
                name="dataType"
                value={trait.dataType}
                onChange={handleChange}
                placeholder={t("traits:create_form.data_type_placeholder")}
                required
              >
                <option value="STRING">{t("traits:create_form.data_type_string")}</option>
                <option value="NUMERIC">{t("traits:create_form.data_type_numeric")}</option>
                <option value="DATE">{t("traits:create_form.data_type_date")}</option>
                <option value="COLOR">{t("traits:create_form.data_type_color")}</option>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel htmlFor="type">{t("traits:create_form.type")}</FormLabel>
              <Select
                id="type"
                name="type"
                value={trait.type}
                onChange={handleChange}
                placeholder={t("traits:create_form.type_placeholder")}
                disabled={trait.dataType != "STRING"}
                required
              >
                {(trait.dataType == "STRING" || trait.dataType == "COLOR") && (
                  <option value="MULTIPLE_CATEGORICAL">{t("traits:create_form.type_multiple_categorical")}</option>
                )}
                {trait.dataType == "STRING" && (
                  <option value="SINGLE_CATEGORICAL">{t("traits:create_form.type_single_categorical")}</option>
                )}
                {trait.dataType != "COLOR" && <option value="RANGE">{t("traits:create_form.type_range")}</option>}
              </Select>
            </FormControl>
          </Box>
          {/* Drop area for drag-and-drop */}
          <div
            {...handleGeneralDrop.getRootProps()}
            style={{
              border: "2px dashed #aaa",
              padding: "5px",
              textAlign: "center",
              width: "80px",
              height: "80px"
            }}
          >
            <input {...handleGeneralDrop.getInputProps()} />
            {trait.generalFile ? (
              <div>
                <img
                  src={URL.createObjectURL(trait.generalFile)}
                  alt="Icon Preview"
                  style={{ height: "70px", objectFit: "cover" }}
                />
              </div>
            ) : (
              <p style={{ padding: "20px" }}>+</p>
            )}
          </div>
          <Box>
            <FormControl>
              <FormLabel htmlFor="speciesField">{t("traits:create_form.species_field")}</FormLabel>
              <Select
                id="speciesField"
                name="speciesField"
                value={trait.speciesField}
                onChange={handleChange}
                placeholder={t("traits:create_form.species_field_placeholder")}
              >
                {speciesCategoryField.concat(speciesSubCategoryField).map((valueObj) => (
                  <option value={valueObj.id}>{valueObj.header}</option>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel htmlFor="source">{t("traits:create_form.source")}</FormLabel>
              <Input
                type="text"
                id="source"
                name="source"
                value={trait.source}
                onChange={handleChange}
                placeholder={t("traits:create_form.source_placeholder")}
                required
              />
            </FormControl>
          </Box>
          <Box>
            {trait.dataType == "NUMERIC" && (
              <FormControl>
                <FormLabel htmlFor="units">{t("traits:create_form.units")}</FormLabel>
                <Input
                  type="text"
                  id="units"
                  name="units"
                  value={trait.units}
                  onChange={handleChange}
                  placeholder={t("traits:create_form.units_placeholder")}
                  required
                />
              </FormControl>
            )}
            {trait.dataType == "DATE" && (
              <FormControl>
                <FormLabel htmlFor="units">{t("traits:create_form.units")}</FormLabel>
                <Select
                  id="units"
                  name="units"
                  value={trait.units}
                  onChange={handleChange}
                  placeholder={t("traits:create_form.units_placeholder")}
                  required
                >
                  <option value="MONTH">{t("traits:create_form.units_month")}</option>
                  <option value="YEAR">{t("traits:create_form.units_year")}</option>
                </Select>
              </FormControl>
            )}
          </Box>
          <Box></Box>
          <Box>
            <FormControl>
              <Checkbox
                id="isObservation"
                name="isObservation"
                isChecked={trait.isObservation}
                onChange={handleChange}
              >
                {t("traits:create_form.observation_trait")}
              </Checkbox>
            </FormControl>
          </Box>
          <GridItem colSpan={{ md: 2 }}>
            <FormControl>
              <Checkbox
                id="Paritcipatory"
                name="Paritcipatory"
                isChecked={trait.Paritcipatory}
                onChange={handleChange}
              >
                {t("traits:create_form.participatory")}
              </Checkbox>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ md: 3 }}>
            <FormControl>
              <FormLabel htmlFor="description">{t("traits:create_form.description")}</FormLabel>
              <Textarea
                id="description"
                name="description"
                value={trait.description}
                onChange={handleChange}
                placeholder={t("traits:create_form.description_placeholder")}
                rows={4}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ md: 3 }}>
            <FormProvider {...hForm}>
              <FormLabel htmlFor="taxon">{t("traits:create_form.taxon")}</FormLabel>
              <SelectAsyncInputField
                name="query"
                onQuery={onQuery}
                optionComponent={ScientificNameOption}
                placeholder={t("traits:create_form.taxon_placeholder")}
                resetOnSubmit={false}
                isClearable={true}
                multiple={true}
              />
            </FormProvider>
          </GridItem>
          {trait.dataType == "NUMERIC" && (
            <>
              <GridItem colSpan={{ md: 4 }}>
                <Heading fontSize="xl">{t("traits:create_form.min_and_max")}</Heading>
              </GridItem>
              <FormControl mb={4}>
                <FormLabel htmlFor="min">{t("traits:create_form.min")}</FormLabel>
                <Input
                  type="number"
                  id="min"
                  name="min"
                  value={trait.min}
                  onChange={handleChange}
                  placeholder={t("traits:create_form.min_placeholder")}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="max">{t("traits:create_form.max")}</FormLabel>
                <Input
                  type="number"
                  id="max"
                  name="max"
                  value={trait.max}
                  onChange={handleChange}
                  placeholder={t("traits:create_form.max_placeholder")}
                />
              </FormControl>
            </>
          )}
          {trait.dataType == "STRING" && (
            <GridItem colSpan={{ md: 3 }}>
              <Heading mb={4} fontSize="xl">
              {t("traits:create_form.trait_values_heading")}
              </Heading>
              {trait.values.map((valueObj, index) => (
                <TraitsValueComponent
                  key={index}
                  valueObj={valueObj}
                  index={index}
                  onValueChange={handleValueChange}
                  onRemove={removeValue}
                />
              ))}
              <Box mb={4}>
                <Button onClick={handleAddValue} colorScheme="green" mb={4}>
                {t("traits:create_form.add_trait_values_button")}
                </Button>
              </Box>
            </GridItem>
          )}
        </SimpleGrid>
        {canSubmit && (
          <Box mb={4}>
            <Button type="submit" colorScheme="blue">
            {t("traits:create_form.add_trait_button")}
            </Button>
          </Box>
        )}
      </form>
    </div>
  ) : (
    <Error statusCode={404} />
  );
}
