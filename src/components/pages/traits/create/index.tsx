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
}

export default function TraitsCreateComponent() {
  const router = useLocalRouter();
  const { t } = useTranslation();

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
    name: "",
    description: "",
    category: "",
    isObservation: false,
    Paritcipatory: false,
    type: "",
    dataType: "",
    values: [
      {
        description: "",
        value: "",
        file: null
      }
    ],
    generalFile: null
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
      values: valueString.slice(0, -1),
      taxonIds: taxonIds,
      icon: null
    };

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

  return (
    <div className="container mt">
      <PageHeading>Add Traits</PageHeading>
      <form onSubmit={handleSubmit}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Box>
            <FormControl>
              <FormLabel htmlFor="name">Trait Name</FormLabel>
              <Input
                type="text"
                id="name"
                name="name"
                value={trait.name}
                onChange={handleChange}
                placeholder="Enter trait name"
                required
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel htmlFor="dataType">Data Type</FormLabel>
              <Select
                id="dataType"
                name="dataType"
                value={trait.dataType}
                onChange={handleChange}
                placeholder="Select type"
                required
              >
                <option value="STRING">String</option>
                <option value="NUMERIC">Numeric</option>
                <option value="DATE">Date</option>
                <option value="COLOR">Color</option>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <FormLabel htmlFor="type">Type</FormLabel>
              <Select
                id="type"
                name="type"
                value={trait.type}
                onChange={handleChange}
                placeholder="Select type"
                required
              >
                <option value="MULTIPLE_CATEGORICAL">Multiple Categorical</option>
                <option value="SINGLE_CATEGORICAL">Single Categorical</option>
                <option value="RANGE">Range</option>
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
              <Checkbox
                id="isObservation"
                name="isObservation"
                isChecked={trait.isObservation}
                onChange={handleChange}
              >
                Observation Trait
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
                Paritcipatory
              </Checkbox>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ md: 3 }}>
            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                name="description"
                value={trait.description}
                onChange={handleChange}
                placeholder="Enter trait description"
                rows={4}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ md: 3 }}>
            <FormProvider {...hForm}>
              <FormLabel htmlFor="taxon">Taxon</FormLabel>
              <SelectAsyncInputField
                name="query"
                onQuery={onQuery}
                optionComponent={ScientificNameOption}
                placeholder={t("filters:taxon_browser.search")}
                resetOnSubmit={false}
                isClearable={true}
                multiple={true}
              />
            </FormProvider>
          </GridItem>
          {trait.dataType == "STRING" && (
            <GridItem colSpan={{ md: 3 }}>
              <Heading mb={4} fontSize="xl">
                Define Trait Values
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
                  Add Trait Value
                </Button>
              </Box>
            </GridItem>
          )}
        </SimpleGrid>
        {canSubmit && (
          <Box mb={4}>
            <Button type="submit" colorScheme="blue">
              Add Traits
            </Button>
          </Box>
        )}
      </form>
    </div>
  );
}
