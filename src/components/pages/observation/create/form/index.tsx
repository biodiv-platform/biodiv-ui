import { Box, useDisclosure } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import CheckBox from "@components/form/checkbox";
import Submit from "@components/form/submit-button";
import useTranslation from "@configs/i18n/useTranslation";
import { DEFAULT_LANGUAGE_ID } from "@static/constants";
import {
  RESOURCES_UPLOADING,
  SYNC_SINGLE_OBSERVATION,
  TOGGLE_PHOTO_SELECTOR
} from "@static/events";
import { parseDate } from "@utils/date";
import { useStoreState } from "easy-peasy";
import React, { useState } from "react";
import { emit, useListener } from "react-gbus";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import SavingObservation from "../saving";
import DateInputs from "./date";
import GroupSelector from "./groups";
import LocationPicker from "./location";
import Recodata from "./recodata";
import TraitsPicker from "./traits";
import Uploader from "./uploader";
import UserGroups from "./user-groups";

export default function ObservationCreateForm({ speciesGroups, languages }) {
  const { t } = useTranslation();
  const { isOpen, onClose } = useDisclosure(true);
  const [isSelectedImages, setIsSelectedImages] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState();
  const { currentGroup } = useStoreState((s) => s);

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

  const hForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
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
      tags: Yup.array(),

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
      terms: Yup.boolean().oneOf([true], "The terms and conditions must be accepted.")
    }),
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

      observedOn: null,
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
      terms: true
    }
  });

  const handleOnSubmit = async ({
    taxonCommonName,
    scientificNameTaxonId,
    taxonScientificName,
    recoComment,
    confidence,
    languageId,
    tags,
    ...rest
  }) => {
    const observedOn = parseDate(rest.observedOn).toISOString();

    const payload = {
      ...rest,
      observedOn,
      createdOn: new Date().toISOString(),
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
      tags: tags.map(({ label, value, version }) => ({
        id: label !== value ? value : null,
        version,
        name: label
      })),
      protocol: "SINGLE_OBSERVATION",
      basisOfRecords: "HUMAN_OBSERVATION",
      obsvLanguageId: DEFAULT_LANGUAGE_ID,
      useDegMinSec: false,
      degMinSec: null
    };

    emit(SYNC_SINGLE_OBSERVATION, { observation: payload, instant: true });
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
          <TraitsPicker name="facts" label={t("OBSERVATION.TRAITS")} form={hForm} />
          <UserGroups name="userGroupId" label={t("OBSERVATION.POST_TO_GROUPS")} form={hForm} />
          <Box mt={4}>
            <CheckBox name="terms" label={t("OBSERVATION.TERMS")} form={hForm} />
          </Box>
          <Submit leftIcon="ibpcheck" form={hForm} isDisabled={isSubmitDisabled}>
            {t("OBSERVATION.ADD_OBSERVATION")}
          </Submit>
        </Box>
      </form>
    </Box>
  ) : (
    <SavingObservation />
  );
}
