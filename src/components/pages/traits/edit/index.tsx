import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Box, Button, GridItem, Image, SimpleGrid, VisuallyHidden } from "@chakra-ui/react";
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
import React from "react";
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

export default function TraitsEditComponent({ data }) {
  const router = useLocalRouter();
  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
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
    ),
    defaultValues: {
      name: data.traits.name,
      description: data.traits.description,
      traitType: data.traits.traitTypes,
      dataType: data.traits.dataType,
      source: data.traits.source,
      isObservation: data.traits.showInObservation,
      isParticipatory: data.traits.isParticipatory,
      values: data.values.sort((a, b) => a.displayOrder - b.displayOrder)
    }
  });

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
      {hForm.watch("dataType") == "STRING" && hForm.watch("traitType") == "RANGE" && (
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
      <TextBoxField name={`values[${value}].value`} label={`Value ${value + 1}`} />
      <TextBoxField name={`values[${value}].description`} label={`Description ${value + 1}`} />
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
          {hForm.watch("values")[value].icon && (
            <Image
              boxSize="2.2rem"
              objectFit="contain"
              src={getTraitIcon(hForm.watch("values")[value].icon)}
              alt={hForm.watch("values")[value].icon}
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
        {!hForm.watch("values")[value].id && (
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

  const SortableList = SortableContainer<{items:any}>(({ items }) => {
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
      hForm.watch("traitType") !== "RANGE"
    );
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newOrder = arrayMoveImmutable(hForm.getValues("values"), oldIndex, newIndex);
    hForm.setValue("values", newOrder);
  };

  const handleOnPhotoUpload = async (e) => {
    const index = Number(e.target.id);
    const { success, data } = await axUploadResource(e.target.files[0], "traits", undefined);
    if (success) {
      const values = hForm.watch("values");
      values[index].icon = data;
      hForm.setValue("values", values);
    }
  };

  const handleOnUpdate = async (payload) => {
    const params = {
      description: payload.description,
      id: data.traits.id,
      name: payload.name,
      traitTypes: payload.traitType,
      showInObservation: payload.isObservation,
      isParticipatory: payload.isParticipatory,
      source: payload.source
    };
    const { success } = await axUpdateTrait(params, hForm.getValues("values"));
    if (success) {
      notification("Trait Updated", NotificationType.Success);
      router.push(`/traits/show/${data.traits.id}`, true);
    } else {
      notification("Unable to update");
    }
  };

  const handleAddValue = () => {
    hForm.setValue("values", [
      ...hForm.watch("values"),
      { value: "", description: "", icon: null, id: null }
    ]);
  };

  const removeValue = (index) => {
    hForm.setValue(
      "values",
      hForm.watch("values").filter((_, i) => i !== index)
    );
  };

  return (
    <div className="container mt">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <GridItem className="white-box" mb={4} colSpan={{ md: 4 }}>
          <FormProvider {...hForm}>
            <form onSubmit={hForm.handleSubmit(handleOnUpdate)}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4} mt={4} ml={3} mr={3}>
                <TextBoxField name="name" label={"Name"} />
                <SelectInputField name="traitType" label={"Trait Type"} options={TRAIT_TYPES} />
                <SelectInputField
                  name="dataType"
                  label={"Data Type"}
                  options={DATA_TYPES}
                  disabled={true}
                />
                <TextBoxField name="source" label={"Source"} />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4} mt={4} ml={3} mr={3}>
                <CheckboxField name="isObservation" label={"Observation Trait"} />
                <CheckboxField name="isParticipatory" label={"Participatory"} />
              </SimpleGrid>
              <Box ml={3} mr={3}>
                <TextAreaField name="description" label="Description" />
                {hForm.watch("dataType") == "STRING" && (
                  <Box mx="auto">
                    <SortableList
                      items={hForm.watch("values")}
                      onSortEnd={onSortEnd}
                      shouldCancelStart={shouldCancelStart}
                    />
                  </Box>
                )}
                <Box mb={4}>
                  <Button onClick={handleAddValue} colorScheme="green" mb={4}>
                    Add Trait Value
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
