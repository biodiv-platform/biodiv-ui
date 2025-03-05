import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Textarea,
  useDisclosure,
  VisuallyHidden
} from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { axUploadResource } from "@services/files.service";
import { axUpdateTrait } from "@services/traits.service";
import { getTraitIcon } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import { arrayMoveImmutable } from "array-move";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import * as Yup from "yup";

export default function TraitsEditComponent({ data, languages, langId }) {
  const { t } = useTranslation();
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
  const [translationSelected, setTranslationSelected] = useState<number>(0);
  const router = useLocalRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [trait, setTrait] = useState({
    name: "",
    description: "",
    langId: 0,
    source: ""
  });
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
        )
      })
    )
  });

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(formSchema),
    defaultValues: {
      translations: data.map((trait) => ({
        traits: {
          id: trait.traits.id,
          createdOn: null,
          lastRevised: null,
          fieldId: trait.traits.fieldId,
          units: trait.traits.units,
          isNotObservationTraits: trait.traits.isNotObservationTraits,
          isDeleted: trait.traits.isDeleted,
          icon: trait.traits.icon,
          traitId: trait.traits.traitId,
          languageId: trait.traits.languageId,
          name: trait.traits.name,
          description: trait.traits.description,
          traitTypes: trait.traits.traitTypes,
          dataType: trait.traits.dataType,
          source: trait.traits.source,
          showInObservation: trait.traits.showInObservation,
          isParticipatory: trait.traits.isParticipatory
        },
        values: trait.values.sort((a, b) => a.displayOrder - b.displayOrder)
      }))
    }
  });

  useEffect(() => {
    const index = data.findIndex((obj) => obj.traits.languageId == langId);
    if (index !== -1) {
      setTranslationSelected(index);
    }
  }, [langId, data]);

  const SortableItem = SortableElement<{ value: number }>(({ value }) => (
    <SimpleGrid
      columns={{ base: 1, md: 5 }}
      spacingX={4}
      mt={2}
      ml={3}
      mr={3}
      p={2}
      textAlign="center"
      mb={1}
      cursor="grab"
      _hover={{ bg: "lightgray" }}
    >
      {hForm.watch(`translations[${translationSelected}].traits.dataType`) == "STRING" &&
        hForm.watch(`translations[${translationSelected}].traits.traitTypes`) == "RANGE" && (
          <Box
            position="relative"
            left={0}
            top="50%"
            transform="translateY(-50%)"
            cursor="grab"
            zIndex={2}
          >
            <DragHandleIcon boxSize={5} color="gray.500" />
          </Box>
        )}
      <TextBoxField
        name={`translations[${translationSelected}].values[${value}].value`}
        label={
          hForm.watch(`translations`).filter((t) => t.traits.languageId == langId)[0].values[value]
            .value && hForm.watch(`translations`)[translationSelected].traits.languageId != langId
            ? hForm.watch(`translations`).filter((t) => t.traits.languageId == langId)[0].values[
                value
              ].value
            : t("traits:create_form.value")
        }
      />
      <TextBoxField
        name={`translations[${translationSelected}].values[${value}].description`}
        label={`${t("traits:create_form.description")} ${value + 1}`}
      />
      <Box ml={4}>
        <Button
          type="button"
          as="label"
          cursor="pointer"
          w="15"
          size={"sm"}
          htmlFor={value}
          height={70}
          width={70}
          border={"2px dashed #aaa"}
        >
          {hForm.watch(`translations[${translationSelected}].values`)[value].icon && (
            <Image
              boxSize="2.2rem"
              objectFit="contain"
              src={getTraitIcon(
                hForm.watch(`translations[${translationSelected}].values`)[value].icon
              )}
              alt={hForm.watch(`translations[${translationSelected}].values`)[value].icon}
              ignoreFallback={true}
              mb={2}
            />
          )}
          <VisuallyHidden
            as="input"
            type="file"
            id={value}
            accept="image/*"
            onChange={handleOnPhotoUpload}
          />
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        {!hForm.watch(`translations[${translationSelected}].values`)[value].id &&
          hForm.watch(`translations`)[translationSelected].traits.languageId == langId && (
            <Button
              aria-label="Remove value"
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag event
                removeValue(value); // Call delete function
              }}
              size="sm"
              colorScheme="red"
            >
              <CloseIcon />
            </Button>
          )}
      </Box>
    </SimpleGrid>
  ));

  const SortableList = SortableContainer<{ items: any }>(({ items }) => {
    return (
      <Box>
        {items.map((value, index) => (
          <SortableItem key={`item-${value.id}`} index={index} value={index} />
        ))}
      </Box>
    );
  });

  const shouldCancelStart = (e) => {
    // Ignore clicks on file inputs or labels
    return (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "LABEL" ||
      e.target.tagName === "BUTTON" ||
      hForm.watch(`translations[${translationSelected}].traits.traitTypes`) !== "RANGE"
    );
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    hForm.watch("translations").forEach((_, index) => {
      const newOrder = arrayMoveImmutable(
        hForm.getValues(`translations[${index}].values`),
        oldIndex,
        newIndex
      );
      hForm.setValue(`translations[${index}].values`, newOrder);
    });
  };

  const handleOnPhotoUpload = async (e) => {
    const index = Number(e.target.id);
    const { success, data } = await axUploadResource(e.target.files[0], "traits", undefined);
    if (success) {
      hForm.watch("translations").forEach((_, i) => {
        const values = hForm.watch(`translations[${i}].values`);
        values[index].icon = data;
        hForm.setValue(`translations[${i}].values`, values);
      });
    }
  };

  const handleOnUpdate = async (payload) => {
    const { success } = await axUpdateTrait(data[0].traits.traitId, payload.translations);
    if (success) {
      notification("Trait Updated", NotificationType.Success);
      router.push(`/traits/show/${data[0].traits.traitId}`, true);
    } else {
      notification("Unable to update");
    }
  };

  const handleAddValue = () => {
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
          languageId: parseInt(trait.langId.toString(), 10),
          name: trait.name,
          description: trait.description,
          traitTypes: hForm.watch(`translations[0].traits.traitTypes`),
          dataType: hForm.watch(`translations[0].traits.dataType`),
          source: trait.source,
          showInObservation: hForm.watch(`translations[0].traits.showInObservation`),
          isParticipatory: hForm.watch(`translations[0].traits.isParticipatory`)
        },
        values: hForm
          .watch(`translations`)
          .filter((t) => t.traits.languageId == langId)[0]
          .values.map((value) => ({
            description: "",
            icon: value.icon,
            id: null,
            isDeleted: false,
            source: "",
            traitInstanceId: null,
            value: "",
            displayOrder: null,
            languageId: parseInt(trait.langId.toString(), 10),
            traitValueId: value.traitValueId
          }))
      }
    ]);
  };

  const removeValue = (DeleteIndex) => {
    if (hForm.watch(`translations[${translationSelected}].traits.languageId`) == langId) {
      hForm.watch("translations").forEach((_, index) => {
        hForm.setValue(
          `translations[${index}].values`,
          hForm.watch(`translations[${index}].values`).filter((_, i) => i !== DeleteIndex)
        );
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrait((prevTrait) => ({
      ...prevTrait,
      [name]: value
    }));
  };

  return (
    <div className="container mt">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleAddTranslation();
              setTrait({
                name: "",
                description: "",
                langId: 0,
                source: ""
              });
              onClose();
            }}
          >
            <ModalHeader> {t("traits:create_form.add_translation_button")}</ModalHeader>
            <ModalBody>
              <Box>
                <FormControl mb={2} isRequired={true}>
                  <FormLabel htmlFor="name">{t("traits:create_form.language")}</FormLabel>
                  <Select
                    id="langId"
                    name="langId"
                    placeholder={t("traits:create_form.language_placeholder")}
                    required
                    value={trait.langId}
                    onChange={handleChange}
                  >
                    {languages.map((lang) => (
                      <option value={lang.id}>{lang.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mb={2} isRequired={true}>
                  <FormLabel htmlFor="name">{t("traits:create_form.trait_name")}</FormLabel>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t("traits:create_form.trait_name_placeholder")}
                    value={trait.name}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel htmlFor="name">{t("traits:create_form.source")}</FormLabel>
                  <Input
                    type="text"
                    id="source"
                    name="source"
                    placeholder={t("traits:create_form.source_placeholder")}
                    value={trait.source}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel htmlFor="name">{t("traits:create_form.description")}</FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={t("traits:create_form.description_placeholder")}
                    value={trait.description}
                    onChange={handleChange}
                  />
                </FormControl>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={() => {
                  setTrait({
                    name: "",
                    description: "",
                    langId: 0,
                    source: ""
                  });
                  onClose();
                }}
              >
                {t("traits:create_form.cancel")}
              </Button>
              <Button colorScheme="blue" type="submit">
                {t("traits:create_form.continue")}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <Flex justify="flex-end" width="100%" mb={4} onClick={onOpen}>
        <Button colorScheme="green">{t("traits:create_form.add_translation_button")}</Button>
      </Flex>
      <Tabs
        overflowX="auto"
        mb={4}
        variant="unstyled"
        bg="gray.100"
        rounded="md"
        index={translationSelected}
        onChange={(index) => setTranslationSelected(index)}
      >
        <TabList>
          {hForm.watch(`translations`).map((translation) => (
            <Tab
              key={translation.language}
              _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
              m={1}
            >
              {languages.filter((lang) => lang.id === translation.traits.languageId)[0].name}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <GridItem className="white-box" mb={4} colSpan={{ md: 4 }}>
          <FormProvider {...hForm}>
            <form onSubmit={hForm.handleSubmit(handleOnUpdate)}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4} mt={4} ml={3} mr={3}>
                <Box>
                  <TextBoxField
                    key={`name-${translationSelected}`}
                    name={`translations[${translationSelected}].traits.name`}
                    label={t("traits:create_form.trait_name")}
                    isRequired={true}
                  />
                </Box>
                <SelectInputField
                  key={`traitType-${translationSelected}`}
                  name={`translations[${translationSelected}].traits.traitTypes`}
                  label={t("traits:create_form.type")}
                  options={TRAIT_TYPES}
                  onChangeCallback={(value) =>
                    hForm.watch("translations").forEach((_, index) => {
                      hForm.setValue(`translations[${index}].traits.traitTypes`, value);
                    })
                  }
                  isRequired={true}
                />
                <SelectInputField
                  key={`dataType-${translationSelected}`}
                  name={`translations[${translationSelected}].traits.dataType`}
                  label={t("traits:create_form.data_type")}
                  options={DATA_TYPES}
                  disabled={true}
                  isRequired={true}
                />
                <TextBoxField
                  key={`source-${translationSelected}`}
                  name={`translations[${translationSelected}].traits.source`}
                  label={t("traits:create_form.source")}
                />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4} mt={4} ml={3} mr={3}>
                <CheckboxField
                  key={`isObservation-${translationSelected}`}
                  name={`translations[${translationSelected}].traits.showInObservation`}
                  label={t("traits:create_form.observation_trait")}
                  onChangeCallback={(value) =>
                    hForm.watch("translations").forEach((_, index) => {
                      hForm.setValue(`translations[${index}].traits.showInObservation`, value);
                      hForm.setValue(
                        `translations[${index}].traits.isNotObservationTraits`,
                        !value
                      );
                    })
                  }
                />
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
              </SimpleGrid>
              <Box ml={3} mr={3}>
                <TextAreaField
                  key={`description-${translationSelected}`}
                  name={`translations[${translationSelected}].traits.description`}
                  label={t("traits:create_form.description")}
                />
                {hForm.watch(`translations[${translationSelected}].traits.dataType`) ==
                  "STRING" && (
                  <Box mx="auto">
                    <SortableList
                      items={hForm.watch(`translations[${translationSelected}].values`)}
                      onSortEnd={onSortEnd}
                      shouldCancelStart={shouldCancelStart}
                    />
                  </Box>
                )}
                <Box mb={4}>
                  {hForm.watch(`translations[${translationSelected}].traits.languageId`) ==
                    langId && (
                    <Button onClick={handleAddValue} colorScheme="green" mb={4}>
                      {t("traits:create_form.add_trait_values_button")}
                    </Button>
                  )}
                </Box>
                <SubmitButton mb={4}>{t("traits:create_form.save")}</SubmitButton>
              </Box>
            </form>
          </FormProvider>
        </GridItem>
      </SimpleGrid>
    </div>
  );
}
