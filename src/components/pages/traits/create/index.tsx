import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Tabs,
  useDisclosure
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import { axUploadResource } from "@services/files.service";
import { axCreateTrait } from "@services/traits.service";
import { getTraitIcon } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import * as Yup from "yup";

import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";

import TraitsValueComponent from "./trait-value-component";

const onQuery = (q) => onScientificNameQuery(q, "name");

export default function TraitsCreateComponent({ speciesField, languages }) {
  const { t } = useTranslation();
  const { languageId } = useGlobalState();
  const TRAIT_TYPES = [
    { label: t("traits:create_form.type_multiple_categorical"), value: "MULTIPLE_CATEGORICAL" },
    { label: t("traits:create_form.type_single_categorical"), value: "SINGLE_CATEGORICAL" },
    { label: t("traits:create_form.type_range"), value: "RANGE" }
  ];
  const DATA_TYPES = [
    { label: t("traits:create_form.data_type_date"), value: "DATE" },
    { label: t("traits:create_form.data_type_string"), value: "STRING" },
    { label: t("traits:create_form.data_type_numeric"), value: "NUMERIC" },
    { label: t("traits:create_form.data_type_color"), value: "COLOR" }
  ];
  const speciesCategoryField = speciesField
    .filter((item) => item.childFields.length == 0)
    .map((item) => item.parentField);
  const speciesSubCategoryField = speciesField
    .filter((item) => item.childFields.length != 0)
    .map((item) => item.childFields)
    .flat();
  const router = useLocalRouter();
  const [translationSelected, setTranslationSelected] = useState<number>(0);
  const formSchema = Yup.object().shape({
    translations: Yup.array().of(
      Yup.object().shape({
        traits: Yup.object().shape({
          id: Yup.number().nullable(),
          createdOn: Yup.date().nullable(),
          lastRevised: Yup.date().nullable(),
          fieldId: Yup.number().nullable().optional(),
          units: Yup.string().nullable().optional(),
          isNotObservationTraits: Yup.boolean(),
          isDeleted: Yup.boolean(),
          icon: Yup.string().nullable(),
          traitId: Yup.number().nullable(),
          languageId: Yup.number(),
          name: Yup.string(),
          description: Yup.string(),
          traitTypes: Yup.string(),
          dataType: Yup.string(),
          source: Yup.string(),
          showInObservation: Yup.boolean(),
          isParticipatory: Yup.boolean()
        }),
        values: Yup.array().of(
          Yup.object().shape({
            description: Yup.string(),
            icon: Yup.string().nullable(),
            id: Yup.number().nullable(),
            isDeleted: Yup.boolean(),
            source: Yup.string(),
            traitInstanceId: Yup.number().nullable(),
            value: Yup.string(),
            displayOrder: Yup.number().nullable(),
            languageId: Yup.number().nullable(),
            traitValueId: Yup.number().nullable()
          })
        ),
        query: Yup.array().of(
          Yup.object().shape({
            taxonId: Yup.number()
          })
        )
      })
    )
  });

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(formSchema),
    defaultValues: {
      translations: [
        {
          traits: {
            id: null,
            createdOn: null,
            lastRevised: null,
            fieldId: undefined,
            units: undefined,
            isNotObservationTraits: true,
            isDeleted: false,
            icon: null,
            traitId: null,
            languageId: languageId,
            name: "",
            description: "",
            traitTypes: "",
            dataType: "",
            source: "",
            showInObservation: false,
            isParticipatory: false
          },
          values: [],
          query: []
        }
      ]
    }
  });

  const options = (() => {
    switch (hForm.watch(`translations[${translationSelected}].traits.dataType`)) {
      case "COLOR":
        return [TRAIT_TYPES[0]];
      case "DATE":
        return [TRAIT_TYPES[2]];
      case "NUMERIC":
        return [TRAIT_TYPES[2]];
      default:
        return TRAIT_TYPES;
    }
  })();

  const { open, onClose, onOpen } = useDisclosure();
  const [langId, setLangId] = useState(0);

  // Dropzone setup, with a single file restriction
  const handleGeneralDrop = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const { success, data } = await axUploadResource(file, "traits", undefined);
        if (success) {
          hForm.watch("translations").forEach((_, index) => {
            hForm.setValue(`translations[${index}].traits.icon`, data);
          });
        }
      }
    }
  });

  const handleOnSubmit = async (payload) => {
    const seenLangIds: Set<number> = new Set(); // or Set<string> if IDs are strings
    const duplicates: number[] = [];

    for (const translation of payload.translations) {
      const langId = translation.traits.languageId;
      if (seenLangIds.has(langId)) {
        duplicates.push(langId);
      } else {
        seenLangIds.add(langId);
      }
    }

    if (duplicates.length > 0) {
      notification("Please remove duplicate language translations");
      return; // stop update if duplicate found
    }
    const query = payload.translations[0].query.map((taxan) => ({
      taxonomyDefifintionId: taxan.taxonId,
      traitTaxonId: null
    }));
    const { success, data } = await axCreateTrait(
      payload.translations.map((value) => ({ ...value, query: query }))
    );
    if (success) {
      notification("Trait Created", NotificationType.Success);
      router.push(`/traits/show/${data}`, true);
    } else {
      notification("Unable to create");
    }
  };

  function handleAddValue() {
    hForm.watch("translations").forEach((_, index) => {
      hForm.setValue(`translations[${index}].values`, [
        ...hForm.watch(`translations[${index}].values`),
        {
          description: "",
          icon: null,
          id: null,
          isDeleted: false,
          source: "",
          traitInstanceId: null,
          value: "",
          displayOrder: null,
          languageId: hForm.watch(`translations[${index}].traits.languageId`),
          traitValueId: null
        }
      ]);
    });
  }

  const removeValue = (DeleteIndex) => {
    if (hForm.watch(`translations[${translationSelected}].traits.languageId`) == languageId) {
      hForm.watch("translations").forEach((_, index) => {
        hForm.setValue(
          `translations[${index}].values`,
          hForm.watch(`translations[${index}].values`).filter((_, i) => i !== DeleteIndex)
        );
      });
    }
  };

  const valueImageChange = (index, value) => {
    hForm.watch("translations").forEach((_, i) => {
      const values = hForm.watch(`translations[${i}].values`);
      values[index].icon = value;
      hForm.setValue(`translations[${i}].values`, values);
    });
  };

  const handleAddTranslation = () => {
    setTranslationSelected(hForm.watch("translations").length);
    hForm.setValue(`translations`, [
      ...hForm.watch(`translations`),
      {
        traits: {
          id: null,
          createdOn: null,
          lastRevised: null,
          fieldId: hForm.watch(`translations[0].traits.fieldId`),
          units: hForm.watch(`translations[0].traits.units`),
          isNotObservationTraits: hForm.watch(`translations[0].traits.isNotObservationTraits`),
          isDeleted: false,
          icon: hForm.watch(`translations[0].traits.icon`),
          traitId: null,
          languageId: parseInt(langId.toString(), 10),
          name: "",
          description: "",
          traitTypes: hForm.watch(`translations[0].traits.traitTypes`),
          dataType: hForm.watch(`translations[0].traits.dataType`),
          source: "",
          showInObservation: hForm.watch(`translations[0].traits.showInObservation`),
          isParticipatory: hForm.watch(`translations[0].traits.isParticipatory`)
        },
        values: hForm
          .watch(`translations`)
          .filter((t) => t.traits.languageId == languageId)[0]
          .values.map((value) => ({
            description: "",
            icon: value.icon,
            id: null,
            isDeleted: false,
            source: "",
            traitInstanceId: null,
            value: "",
            displayOrder: null,
            languageId: parseInt(langId.toString(), 10),
            traitValueId: null
          })),
        query: hForm.watch(`translations[0].query`)
      }
    ]);
  };

  return (
    <div className="container mt">
      <PageHeading>{t("traits:create_form.heading")}</PageHeading>
      <DialogRoot open={open} onOpenChange={onClose}>
        <DialogBackdrop />
        <DialogContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleAddTranslation();
              setLangId(0);
              onClose();
            }}
          >
            <DialogHeader> {t("traits:create_form.add_translation_button")}</DialogHeader>
            <DialogBody>
              <Box>
                <Field
                  mb={2}
                  required={true}
                  htmlFor="name"
                  label={t("traits:create_form.language")}
                >
                  <Select
                    id="langId"
                    inputId="langId"
                    name="langId"
                    placeholder={t("traits:create_form.language_placeholder")}
                    onChange={(o: { value: number; label: string }) => {
                      setLangId(o.value);
                    }}
                    components={{
                      IndicatorSeparator: () => null
                    }}
                    options={languages
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((lang) => ({
                        value: lang.id,
                        label: lang.name
                      }))}
                    isSearchable={true} // Enables search
                  />
                </Field>
              </Box>
            </DialogBody>
            <DialogFooter>
              <Button
                mr={3}
                onClick={() => {
                  setLangId(0);
                  onClose();
                }}
              >
                {t("traits:create_form.cancel")}
              </Button>
              <Button colorPalette="blue" type="submit">
                {t("traits:create_form.continue")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
      <Flex justify="flex-end" width="100%" mb={4} onClick={onOpen}>
        <Button colorPalette="green">{t("traits:create_form.add_translation_button")}</Button>
      </Flex>
      <Tabs.Root
        overflowX="auto"
        mb={4}
        bg="gray.100"
        rounded="md"
        variant="plain"
        value={translationSelected.toString()}
        onValueChange={({ value }) => setTranslationSelected(Number(value))}
      >
        <Tabs.List>
          {hForm.watch(`translations`).map((translation, index) => (
            <Tabs.Trigger
              key={translation.traits.languageId}
              value={index.toString()}
              _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
              m={1}
            >
              {languages.filter((lang) => lang.id === translation.traits.languageId)[0].name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
            <Box>
              <TextBoxField
                key={`name-${translationSelected}`}
                name={`translations[${translationSelected}].traits.name`}
                label={
                  hForm.watch(`translations`).filter((t) => t.traits.languageId == languageId)[0]
                    .traits.name &&
                  hForm.watch(`translations`)[translationSelected].traits.languageId != languageId
                    ? hForm
                        .watch(`translations`)
                        .filter((t) => t.traits.languageId == languageId)[0].traits.name
                    : t("traits:create_form.trait_name")
                }
                isRequired={true}
              />
            </Box>
            <Box>
              <SelectInputField
                key={`dataType-${translationSelected}`}
                name={`translations[${translationSelected}].traits.dataType`}
                label={t("traits:create_form.data_type")}
                options={DATA_TYPES}
                onChangeCallback={(value) =>
                  hForm.watch("translations").forEach((_, index) => {
                    hForm.setValue(`translations[${index}].traits.dataType`, value);
                    if (value == "COLOR") {
                      hForm.setValue(
                        `translations[${index}].traits.traitTypes`,
                        "MULTIPLE_CATEGORICAL"
                      );
                    } else if (value == "DATE") {
                      hForm.setValue(`translations[${index}].traits.traitTypes`, "RANGE");
                    } else if (value == "NUMERIC") {
                      hForm.setValue(`translations[${index}].traits.traitTypes`, "RANGE");
                    }
                  })
                }
                isRequired={true}
              />
            </Box>
            <Box>
              <SelectInputField
                key={`traitType-${translationSelected}-${hForm.watch(
                  `translations[${translationSelected}].traits.traitTypes`
                )}`}
                name={`translations[${translationSelected}].traits.traitTypes`}
                label={t("traits:create_form.type")}
                options={options}
                onChangeCallback={(value) =>
                  hForm.watch("translations").forEach((_, index) => {
                    hForm.setValue(`translations[${index}].traits.traitTypes`, value);
                  })
                }
                isRequired={true}
              />
            </Box>
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
              {hForm.watch(`translations[${translationSelected}].traits.icon`) ? (
                <div>
                  <img
                    src={getTraitIcon(
                      hForm.watch(`translations[${translationSelected}].traits.icon`)
                    )}
                    alt="Icon Preview"
                    style={{ height: "70px", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <p style={{ padding: "20px" }}>+</p>
              )}
            </div>
            <Box>
              <SelectInputField
                key={`field-${translationSelected}`}
                name={`translations[${translationSelected}].traits.fieldId`}
                label={t("traits:create_form.species_field")}
                options={speciesCategoryField.concat(speciesSubCategoryField).map((valueObj) => ({
                  label: valueObj.header,
                  value: valueObj.id
                }))}
                onChangeCallback={(value) =>
                  hForm.watch("translations").forEach((_, index) => {
                    hForm.setValue(`translations[${index}].traits.fieldId`, value);
                  })
                }
                isRequired={true}
              />
            </Box>
            <Box>
              <TextBoxField
                key={`source-${translationSelected}`}
                name={`translations[${translationSelected}].traits.source`}
                label={t("traits:create_form.source")}
              />
            </Box>
            <Box>
              {hForm.watch(`translations[${translationSelected}].traits.dataType`) == "NUMERIC" && (
                <TextBoxField
                  key={`units-${translationSelected}`}
                  name={`translations[${translationSelected}].traits.units`}
                  label={t("traits:create_form.units")}
                  onChangeCallback={(value) =>
                    hForm.watch("translations").forEach((_, index) => {
                      hForm.setValue(`translations[${index}].traits.units`, value);
                    })
                  }
                />
              )}
              {hForm.watch(`translations[${translationSelected}].traits.dataType`) == "DATE" && (
                <SelectInputField
                  key={`units-${translationSelected}`}
                  name={`translations[${translationSelected}].traits.units`}
                  label={t("traits:create_form.units")}
                  options={[
                    { label: t("traits:create_form.units_month"), value: "MONTH" },
                    { label: t("traits:create_form.units_year"), value: "YEAR" }
                  ]}
                  onChangeCallback={(value) =>
                    hForm.watch("translations").forEach((_, index) => {
                      hForm.setValue(`translations[${index}].traits.units`, value);
                    })
                  }
                />
              )}
            </Box>
            <Box></Box>
            <Box>
              <CheckboxField
                key={`isObservation-${translationSelected}`}
                name={`translations[${translationSelected}].traits.showInObservation`}
                label={t("traits:create_form.observation_trait")}
                onChangeCallback={(value) =>
                  hForm.watch("translations").forEach((_, index) => {
                    hForm.setValue(`translations[${index}].traits.showInObservation`, value);
                    hForm.setValue(`translations[${index}].traits.isNotObservationTraits`, !value);
                  })
                }
              />
            </Box>
            <GridItem colSpan={{ md: 2 }}>
              <CheckboxField
                key={`isParticipatory-${translationSelected}`}
                name={`translations[${translationSelected}].traits.isParticipatory`}
                label={t("traits:create_form.participatory")}
                onChangeCallback={(value) =>
                  hForm.watch("translations").forEach((_, index) => {
                    hForm.setValue(`translations[${index}].traits.isParticipatory`, value);
                  })
                }
              />
            </GridItem>
            <GridItem colSpan={{ md: 3 }}>
              <TextAreaField
                key={`description-${translationSelected}`}
                name={`translations[${translationSelected}].traits.description`}
                label={t("traits:create_form.description")}
              />
            </GridItem>
            <GridItem colSpan={{ md: 3 }}>
              <SelectInputField
                key={`traitType-${translationSelected}`}
                name={`translations[${translationSelected}].traits.languageId`}
                label={t("traits:create_form.language")}
                options={languages.map((valueObj) => ({
                  label: valueObj.name,
                  value: valueObj.id
                }))}
              />
            </GridItem>
            <GridItem colSpan={{ md: 3 }}>
              <Field htmlFor="taxon" label={t("traits:create_form.taxon")} />
              <SelectAsyncInputField
                name={`translations[${translationSelected}].query`}
                onQuery={onQuery}
                optionComponent={ScientificNameOption}
                placeholder={t("traits:create_form.taxon_placeholder")}
                resetOnSubmit={false}
                isClearable={true}
                multiple={true}
                onChange={(value) =>
                  hForm.watch("translations").forEach((_, index) => {
                    hForm.setValue(`translations[${index}].query`, value);
                  })
                }
              />
            </GridItem>
            {hForm.watch(`translations[${translationSelected}].traits.dataType`) == "STRING" && (
              <GridItem colSpan={{ md: 3 }}>
                {hForm.watch(`translations[${translationSelected}].traits.languageId`) ==
                  languageId && (
                  <Heading mb={4} fontSize="xl">
                    {t("traits:create_form.trait_values_heading")}
                  </Heading>
                )}
                {hForm.watch(`translations[${translationSelected}].traits.languageId`) !=
                  languageId && (
                  <Heading mb={4} fontSize="xl">
                    {t("traits:create_form.translate_values_heading")}
                  </Heading>
                )}
                {hForm.watch(`translations[${translationSelected}].values`).map((_, index) => (
                  <TraitsValueComponent
                    key={index}
                    valueObj={hForm.watch(`translations`)}
                    index={index}
                    onRemove={removeValue}
                    translationSelected={translationSelected}
                    langId={languageId}
                    onValueImageChange={valueImageChange}
                  />
                ))}
                <Box mb={4}>
                  {hForm.watch(`translations[${translationSelected}].traits.languageId`) ==
                    languageId && (
                    <Button onClick={handleAddValue} colorPalette="green" mb={4}>
                      {t("traits:create_form.add_trait_values_button")}
                    </Button>
                  )}
                </Box>
              </GridItem>
            )}
          </SimpleGrid>
          <Box mb={4} display="flex" justifyContent="flex-end">
            <SubmitButton>{t("traits:create_form.add_trait_button")}</SubmitButton>
          </Box>
        </form>
      </FormProvider>
    </div>
  );
}
