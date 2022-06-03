import { Box, useDisclosure } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { CheckboxField } from "@components/form/checkbox";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { RESOURCES_UPLOADING } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useListener } from "react-gbus";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";

import { handleOnSingleObservationSubmit } from "../../create2/common";
import SavingObservation from "../saving";
import ObservationCustomFieldForm from "./custom-field-form";
import DateInputs from "./date";
import GroupSelector from "./groups";
import LocationPicker from "./location";
import Recodata from "./recodata";
import TraitsPicker from "./traits";
import Uploader from "./uploader";
import UserGroups from "./user-groups";

export const parseDefaultCustomField = (list, currentGroup) => {
  return list?.map(
    ({
      customFields: { fieldType, dataType, name, notes, id: customFieldId },
      cfValues,
      defaultValue,
      displayOrder,
      isMandatory: isRequired
    }) => ({
      customFieldId,
      dataType,
      defaultValue,
      displayOrder,
      fieldType,
      isRequired,
      label: name,
      notes,
      value: null,
      options: cfValues.map(({ values, id, iconURL }) => ({
        value: id,
        label: values,
        iconURL,
        userGroupId: currentGroup.id,
        fieldType
      }))
    })
  );
};

export default function ObservationCreateForm({
  speciesGroups,
  languages,
  licensesList,
  ObservationCreateFormData
}) {
  const { t } = useTranslation();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [isSelectedImages, setIsSelectedImages] = useState<boolean>();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState();
  const [customFieldList] = useState(
    ObservationCreateFormData?.customField?.sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const { currentGroup, languageId } = useGlobalState();

  useListener(
    (isUploading) => {
      setIsSubmitDisabled(isUploading);
    },
    [RESOURCES_UPLOADING]
  );

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        sGroup: Yup.mixed().required(),
        helpIdentify: Yup.boolean().required(),

        // recoData
        taxonCommonName: Yup.string().nullable(),
        scientificNameTaxonId: Yup.mixed().nullable(),
        taxonScientificName: Yup.string().nullable(),
        recoComment: Yup.string().nullable(),
        confidence: Yup.number().nullable(),
        languageId: Yup.mixed().nullable(),

        // Extra
        notes: Yup.string().nullable(),
        tags: Yup.array().nullable(),

        // Date and Location
        observedOn: Yup.string().required(),
        dateAccuracy: Yup.string().required(),
        observedAt: Yup.string().required(),
        reverseGeocoded: Yup.string().required(),
        locationScale: Yup.string().required(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        hidePreciseLocation: Yup.boolean(),

        facts: Yup.object().required(),
        userGroupId: Yup.array(),
        resources: Yup.array().min(1).required(),
        terms: Yup.boolean().oneOf([true], "The terms and conditions must be accepted."),

        //custom field data
        customFields: Yup.array().of(
          Yup.object().shape({
            isRequired: Yup.boolean(),
            value: Yup.mixed().when("isRequired", {
              is: true,
              then: Yup.mixed().required(),
              otherwise: Yup.mixed().nullable()
            })
          })
        )
      })
    ),
    defaultValues: {
      sGroup: undefined,
      helpIdentify: false,

      taxonCommonName: null,
      scientificNameTaxonId: null,
      taxonScientificName: null,
      recoComment: null,
      confidence: null,
      languageId: null,

      notes: null,
      tags: [],

      dateAccuracy: "ACCURATE",
      observedAt: "",
      reverseGeocoded: "",
      locationScale: "APPROXIMATE",
      latitude: 0,
      longitude: 0,
      hidePreciseLocation: false,

      facts: {},
      userGroupId: currentGroup.id && currentGroup.id > 0 ? [currentGroup.id.toString()] : [],
      resources: [],
      terms: true,

      customFields: parseDefaultCustomField(customFieldList, currentGroup)
    }
  });

  const { fields }: any = useFieldArray({
    control: hForm.control,
    name: "customFields"
  });

  const handleOnSubmit = async (values) => {
    await handleOnSingleObservationSubmit(
      values,
      {
        languageId,
        fields,
        currentGroupId: currentGroup.id
      },
      true
    );
    onClose();
  };

  return isOpen ? (
    <Box mb={8} minH="calc(100vh - var(--heading-height))">
      <PageHeading>👋 {t("observation:title")}</PageHeading>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <Uploader
            name="resources"
            licensesList={licensesList}
            onTabIndexChanged={(ti) => setIsSelectedImages(ti > 0)}
          />
          <Box hidden={isSelectedImages}>
            <Recodata languages={languages} />
            <GroupSelector name="sGroup" label={t("form:species_groups")} options={speciesGroups} />
            <LocationPicker />
            <DateInputs />
            {customFieldList && <ObservationCustomFieldForm fields={fields} />}
            <TraitsPicker name="facts" label={t("observation:traits")} />
            <UserGroups name="userGroupId" label={t("observation:post_to_groups")} />
            <Box mt={4}>
              <CheckboxField name="terms" label={t("form:terms")} />
            </Box>
            <SubmitButton leftIcon={<CheckIcon />} isDisabled={isSubmitDisabled}>
              {t("observation:add_observation")}
            </SubmitButton>
          </Box>
        </form>
      </FormProvider>
    </Box>
  ) : (
    <SavingObservation />
  );
}
