import { Box, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { axUpdateTrait } from "@services/traits.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
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
        isObservation: Yup.boolean(),
        isParticipatory: Yup.boolean()
      })
    ),
    defaultValues: {
      name: data.traits.name,
      description: data.traits.description,
      traitType: data.traits.traitTypes,
      dataType: data.traits.dataType,
      isObservation: data.traits.showInObservation,
      isParticipatory: data.traits.isParticipatory
    }
  });

  const handleOnUpdate = async (payload) => {
    const params = {
      description: payload.description,
      id: data.traits.id,
      name: payload.name,
      traitTypes: payload.traitType,
      showInObservation: payload.isObservation,
      isParticipatory: payload.isParticipatory
    };
    const { success } = await axUpdateTrait(params);
    if (success) {
      notification("Trait Updated", NotificationType.Success);
      router.push(`/traits/show/${data.traits.id}`, true);
    } else {
      notification("Unable to update");
    }
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
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4} mt={4} ml={3} mr={3}>
                <CheckboxField name="isObservation" label={"Observation Trait"} />
                <CheckboxField name="isParticipatory" label={"Participatory"} />
              </SimpleGrid>
              <Box ml={3} mr={3}>
                <TextAreaField name="description" label="Description" />
                <SubmitButton mb={4}>{"Save"}</SubmitButton>
              </Box>
            </form>
          </FormProvider>
        </GridItem>
      </SimpleGrid>
    </div>
  );
}
