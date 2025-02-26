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

export const TRAIT_TYPES = [
  { label: "Multiple Categorical", value: "MULTIPLE_CATEGORICAL" },
  { label: "Single Categorical", value: "SINGLE_CATEGORICAL" },
  { label: "Range", value: "RANGE" }
];

export const DATA_TYPES = [
  { label: "Date", value: "DATE" },
  { label: "String", value: "STRING" },
  { label: "Numeric", value: "NUMERIC" },
  { label: "Color", value: "COLOR" }
];

export default function TraitsEditComponent({ data, languages, langId }) {
  const { t } = useTranslation();
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
    traits: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string(),
        traitType: Yup.string().required(),
        dataType: Yup.string().required(),
        source: Yup.string(),
        isObservation: Yup.boolean(),
        isParticipatory: Yup.boolean(),
        values: Yup.array().of(
          Yup.object().shape({
            description: Yup.string(),
            icon: Yup.string().nullable(),
            id: Yup.number().nullable(),
            isDeleted: Yup.boolean(),
            source: Yup.string(),
            traitInstanceId: Yup.number(),
            value: Yup.string()
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
        id: trait.traits.id,
        fieldId: trait.traits.fieldId,
        icon: trait.traits.icon,
        units: trait.traits.units,
        language: trait.traits.languageId,
        name: trait.traits.name,
        description: trait.traits.description,
        traitType: trait.traits.traitTypes,
        dataType: trait.traits.dataType,
        source: trait.traits.source,
        isObservation: trait.traits.showInObservation,
        isParticipatory: trait.traits.isParticipatory,
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
      {hForm.watch(`translation[${translationSelected}].dataType`) == "STRING" &&
        hForm.watch(`translation[${translationSelected}].traitType`) == "RANGE" && (
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
        label={`Value ${value + 1}`}
      />
      <TextBoxField
        name={`translations[${translationSelected}].values[${value}].description`}
        label={`Description ${value + 1}`}
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
      <Box>
        {!hForm.watch(`translations[${translationSelected}].values`)[value].id && (
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
      hForm.watch(`translations[${translationSelected}].traitType`) !== "RANGE"
    );
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newOrder = arrayMoveImmutable(
      hForm.getValues(`translations[${translationSelected}].values`),
      oldIndex,
      newIndex
    );
    hForm.setValue("values", newOrder);
  };

  const handleOnPhotoUpload = async (e) => {
    const index = Number(e.target.id);
    const { success, data } = await axUploadResource(e.target.files[0], "traits", undefined);
    if (success) {
      const values = hForm.watch(`translations[${translationSelected}].values`);
      values[index].icon = data;
      hForm.setValue("values", values);
    }
  };

  const handleOnUpdate = async (payload) => {
    const { success } = await axUpdateTrait(data[0].traits.traitId, payload["translations"]);
    if (success) {
      notification("Trait Updated", NotificationType.Success);
      router.push(`/traits/show/${data.traits.id}`, true);
    } else {
      notification("Unable to update");
    }
  };

  const handleAddValue = () => {
    hForm.setValue(`translations[${translationSelected}].values`, [
      ...hForm.watch(`translations[${translationSelected}].values`),
      { value: "", description: "", icon: null, id: null }
    ]);
  };

  const handleAddTranslation = () => {
    setTranslationSelected(hForm.watch("translations").length);
    hForm.setValue(`translations`, [
      ...hForm.watch(`translations`),
      {
        id: null,
        fieldId: data[0].traits.fieldId,
        icon: data[0].traits.icon,
        units: data[0].traits.units,
        language: parseInt(trait.langId.toString(), 10),
        name: trait.name,
        description: trait.description,
        traitType: data[0].traits.traitTypes,
        dataType: data[0].traits.dataType,
        source: trait.source,
        isObservation: data[0].traits.showInObservation,
        isParticipatory: data[0].traits.isParticipatory,
        values: []
      }
    ]);
  };

  const removeValue = (index) => {
    hForm.setValue(
      `translations[${translationSelected}].values`,
      hForm.watch(`translations[${translationSelected}].values`).filter((_, i) => i !== index)
    );
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
          <ModalHeader> Add Translation</ModalHeader>
          <ModalBody>
            <form>
              <Box>
                <FormControl mb={2}>
                  <FormLabel htmlFor="name">Language</FormLabel>
                  <Select
                    id="langId"
                    name="langId"
                    placeholder={"Select Language"}
                    required
                    value={trait.langId}
                    onChange={handleChange}
                  >
                    {languages.map((lang) => (
                      <option value={lang.id}>{lang.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mb={2}>
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
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={() => {
                onClose();
              }}
            >
              {"Cancel"}
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                handleAddTranslation();
                onClose();
              }}
            >
              {"Continue"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex justify="flex-end" width="100%" mb={4} onClick={onOpen}>
        <Button colorScheme="green">Add Translation</Button>
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
              {languages.filter((lang) => lang.id === translation.language)[0].name}
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
                    name={`translations[${translationSelected}].name`}
                    label={t("traits:create_form.trait_name")}
                  />
                </Box>
                <SelectInputField
                  key={`traitType-${translationSelected}`}
                  name={`translations[${translationSelected}].traitType`}
                  label={t("traits:create_form.type")}
                  options={TRAIT_TYPES}
                  onChangeCallback={(value) =>
                    hForm.watch("translations").forEach((_, index) => {
                      hForm.setValue(`translations[${index}].traitType`, value);
                    })
                  }
                />
                <SelectInputField
                  key={`dataType-${translationSelected}`}
                  name={`translations[${translationSelected}].dataType`}
                  label={t("traits:create_form.data_type")}
                  options={DATA_TYPES}
                  disabled={true}
                />
                <TextBoxField
                  key={`source-${translationSelected}`}
                  name={`translations[${translationSelected}].source`}
                  label={t("traits:create_form.source")}
                />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4} mt={4} ml={3} mr={3}>
                <CheckboxField
                  key={`isObservation-${translationSelected}`}
                  name={`translations[${translationSelected}].isObservation`}
                  label={t("traits:create_form.observation_trait")}
                  onChangeCallback={(value) =>
                    hForm.watch("translations").forEach((_, index) => {
                      hForm.setValue(`translations[${index}].isObservation`, value);
                    })
                  }
                />
                <CheckboxField
                  key={`isParticipatory-${translationSelected}`}
                  name={`translations[${translationSelected}].isParticipatory`}
                  label={t("traits:create_form.participatory")}
                  onChangeCallback={(value) =>
                    hForm.watch("translations").forEach((_, index) => {
                      hForm.setValue(`translations[${index}].isParticipatory`, value);
                    })
                  }
                />
              </SimpleGrid>
              <Box ml={3} mr={3}>
                <TextAreaField
                  key={`description-${translationSelected}`}
                  name={`translations[${translationSelected}].description`}
                  label={t("traits:create_form.description")}
                />
                {hForm.watch(`translations[${translationSelected}].dataType`) == "STRING" && (
                  <Box mx="auto">
                    <SortableList
                      items={hForm.watch(`translations[${translationSelected}].values`)}
                      onSortEnd={onSortEnd}
                      shouldCancelStart={shouldCancelStart}
                    />
                  </Box>
                )}
                <Box mb={4}>
                  <Button onClick={handleAddValue} colorScheme="green" mb={4}>
                    {t("traits:create_form.add_trait_values_button")}
                  </Button>
                </Box>
                <SubmitButton mb={4}>{"Save"}</SubmitButton>
              </Box>
            </form>
          </FormProvider>
        </GridItem>
      </SimpleGrid>
    </div>
  );
}
