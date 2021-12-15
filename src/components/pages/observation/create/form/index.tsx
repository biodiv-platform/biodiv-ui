import { Box, useDisclosure } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { CheckboxField } from "@components/form/checkbox";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import {
  RESOURCES_UPLOADING,
  SYNC_SINGLE_OBSERVATION,
  TOGGLE_PHOTO_SELECTOR
} from "@static/events";
import { dateToUTC } from "@utils/date";
import { cleanFacts, cleanTags } from "@utils/tags";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";

import SavingObservation from "../saving";
import ObservationCustomFieldForm from "./custom-field-form";
import DateInputs from "./date";
import GroupSelector from "./groups";
import LocationPicker from "./location";
import { setLastData } from "./location/use-last-location";
import Recodata from "./recodata";
import TraitsPicker from "./traits";
import Uploader from "./uploader";
import UserGroups from "./user-groups";

export default function ObservationCreateForm({
  speciesGroups,
  languages,
  licensesList,
  ObservationCreateFormData
}) {
  const { t } = useTranslation();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [isSelectedImages, setIsSelectedImages] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState();
  const [customFieldList] = useState(
    ObservationCreateFormData?.customField?.sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const { currentGroup, languageId } = useGlobalState();

  const parseDefaultCustomField = (list) => {
    return list?.map(
      ({
        customFields: { fieldType, dataType, name,notes, id: customFieldId },
        isMandatory: isRequired,
        displayOrder,
        defaultValue,
        cfValues
      }) => ({
        //TODO add default value to i.e. value:options[defaultValue]
        value: null,
        isRequired,
        label: name,
        notes,
        customFieldId,
        defaultValue,
        displayOrder,
        fieldType,
        dataType,
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

  useListener(
    (isUploading) => {
      setIsSubmitDisabled(isUploading);
    },
    [RESOURCES_UPLOADING]
  );

  useListener(
    (e) => {
      setIsSelectedImages(e);
    },
    [TOGGLE_PHOTO_SELECTOR]
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
        useDegMinSec: Yup.boolean(),
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
      useDegMinSec: false,
      hidePreciseLocation: false,

      facts: {},
      userGroupId: currentGroup.id && currentGroup.id > 0 ? [currentGroup.id.toString()] : [],
      resources: [],
      terms: true,

      customFields: parseDefaultCustomField(customFieldList)
    }
  });

  const { fields }: any = useFieldArray({
    control: hForm.control,
    name: "customFields"
  });

  const parseCustomFieldToPayload = (customFields) => {
    if (!customFields) {
      return;
    }
    return fields.reduce((acc, { fieldType, customFieldId }, index) => {
      if (customFields[index]?.value) {
        let val;
        switch (fieldType) {
          case "MULTIPLE CATEGORICAL":
            val = { multipleCategorical: customFields[index]?.value };
            break;
          case "SINGLE CATEGORICAL":
            val = { singleCategorical: customFields[index]?.value };
            break;
          default:
            val = { textBoxValue: customFields[index]?.value };
            break;
        }
        acc.push({
          customFieldId,
          userGroupId: currentGroup.id,
          ...val
        });
      }
      return acc;
    }, []);
  };

  const handleOnSubmit = async ({
    taxonCommonName,
    scientificNameTaxonId,
    taxonScientificName,
    recoComment,
    confidence,
    languageId: lId,
    tags,
    customFields,
    terms,
    facts,
    ...rest
  }) => {
    const observedOn = dateToUTC(rest.observedOn).format();
    const payload = {
      ...rest,
      ...cleanFacts(facts),
      observedOn,
      fromDate: observedOn,
      toDate: observedOn,
      helpIdentify: !taxonCommonName && !taxonScientificName,
      recoData: {
        taxonCommonName,
        scientificNameTaxonId,
        taxonScientificName,
        recoComment,
        confidence,
        languageId: lId
      },
      tags: cleanTags(tags),
      protocol: "SINGLE_OBSERVATION",
      basisOfRecords: "HUMAN_OBSERVATION",
      obsvLanguageId: languageId,
      useDegMinSec: false,
      degMinSec: null
    };
    setLastData(rest.latitude, rest.longitude, rest.observedAt, fields, customFields);
    emit(SYNC_SINGLE_OBSERVATION, {
      observation: { ...payload, customFieldList: parseCustomFieldToPayload(customFields) },
      instant: true
    });
    onClose();
  };

  return isOpen ? (
    <Box mb={8} minH="calc(100vh - var(--heading-height))">
      <PageHeading>👋 {t("observation:title")}</PageHeading>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <Uploader name="resources" licensesList={licensesList} />
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
