import { Box, useDisclosure } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import CheckBox from "@components/form/checkbox";
import Submit from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config.json";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import {
  RESOURCES_UPLOADING,
  SYNC_SINGLE_OBSERVATION,
  TOGGLE_PHOTO_SELECTOR
} from "@static/events";
import { dateToUTC } from "@utils/date";
import { cleanTags } from "@utils/tags";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";
import { useFieldArray, useForm } from "react-hook-form";
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
  ObservationCreateFormData
}) {
  const { t } = useTranslation();
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [isSelectedImages, setIsSelectedImages] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState();
  const [customFieldList] = useState(
    ObservationCreateFormData?.customField?.sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const { currentGroup } = useGlobalState();

  const parseDefaultCustomField = (list) => {
    return list?.map(
      ({
        customFields: { fieldType, dataType, name, id: customFieldId },
        isMandatory: isRequired,
        displayOrder,
        defaultValue,
        cfValues
      }) => ({
        //TODO add default value to i.e. value:options[defaultValue]
        value: null,
        isRequired,
        label: name,
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
        sGroup: Yup.number().required(),
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
        latitude: Yup.number().min(1).required(),
        longitude: Yup.number().min(1).required(),
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
      userGroupId: currentGroup.id > 0 ? [currentGroup.id.toString()] : [],
      resources: [],
      terms: true,

      customFields: parseDefaultCustomField(customFieldList)
    }
  });

  const { fields } = useFieldArray({
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
    languageId,
    tags,
    customFields,
    terms,
    ...rest
  }) => {
    const observedOn = dateToUTC(rest.observedOn).format();
    const payload = {
      ...rest,
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
        languageId
      },
      tags: cleanTags(tags),
      protocol: "SINGLE_OBSERVATION",
      basisOfRecords: "HUMAN_OBSERVATION",
      obsvLanguageId: SITE_CONFIG.LANG.DEFAULT_ID,
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
      <PageHeading>👋 {t("OBSERVATION.TITLE")}</PageHeading>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <Uploader name="resources" form={hForm} />
        <Box hidden={isSelectedImages}>
          <Recodata form={hForm} languages={languages} />
          <GroupSelector
            name="sGroup"
            label={t("OBSERVATION.GROUPS")}
            options={speciesGroups}
            form={hForm}
          />
          <LocationPicker form={hForm} />
          <DateInputs form={hForm} />
          {customFieldList && <ObservationCustomFieldForm fields={fields} form={hForm} />}
          <TraitsPicker name="facts" label={t("OBSERVATION.TRAITS")} form={hForm} />
          <UserGroups name="userGroupId" label={t("OBSERVATION.POST_TO_GROUPS")} form={hForm} />
          <Box mt={4}>
            <CheckBox name="terms" label={t("OBSERVATION.TERMS")} form={hForm} />
          </Box>
          <Submit leftIcon={<CheckIcon />} form={hForm} isDisabled={isSubmitDisabled}>
            {t("OBSERVATION.ADD_OBSERVATION")}
          </Submit>
        </Box>
      </form>
    </Box>
  ) : (
    <SavingObservation />
  );
}
