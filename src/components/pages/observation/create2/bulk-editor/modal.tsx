import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { OBSERVATION_BULK_EDIT_DONE } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { emit } from "react-gbus";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import * as Yup from "yup";

import { parseDefaultCustomField } from "../../create/form";
import ObservationCustomFieldForm from "../../create/form/custom-field-form";
import DateInputs from "../../create/form/date";
import GroupSelector from "../../create/form/groups";
import LocationPicker from "../../create/form/location";
import TraitsPicker from "../../create/form/traits";
import UserGroups from "../../create/form/user-groups";
import useObservationCreate2 from "../use-observation-create2-hook";
import RecoInputs from "./reco-inputs";

export default function BulkEditorModal({ initialValue, onClose }) {
  const { t } = useTranslation();
  const { speciesGroupOptions, observationCreateFormData } = useObservationCreate2();
  const [customFieldList] = useState(
    observationCreateFormData?.customField?.sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const { currentGroup } = useGlobalState();

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        sGroup: Yup.mixed().nullable(),
        helpIdentify: Yup.boolean().nullable(),

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
        observedOn: Yup.string().nullable(),
        dateAccuracy: Yup.string().nullable(),
        observedAt: Yup.string().nullable(),
        locationScale: Yup.string().nullable(),
        latitude: Yup.number().nullable(),
        longitude: Yup.number().nullable(),
        hidePreciseLocation: Yup.boolean(),

        facts: Yup.object().nullable(),
        userGroupId: Yup.array(),

        //custom field data
        customFields: Yup.array()
          .of(
            Yup.object().shape({
              isRequired: Yup.boolean(),
              value: Yup.mixed().when("isRequired", {
                is: true,
                then: Yup.mixed().required(),
                otherwise: Yup.mixed().nullable()
              })
            })
          )
          .nullable(),

        tmp: Yup.mixed().nullable()
      })
    ),
    defaultValues: {
      customFields: parseDefaultCustomField(customFieldList, currentGroup),
      ...initialValue
    }
  });

  const { fields }: any = useFieldArray({
    control: hForm.control,
    name: "customFields"
  });

  const handleOnFormSubmit = (values) => {
    const newProps = Object.fromEntries(Object.entries(values).filter((kv) => kv[1]));
    emit(OBSERVATION_BULK_EDIT_DONE, newProps);
    onClose();
  };

  return (
    <Modal isOpen={initialValue} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("observation:title_edit")}</ModalHeader>
        <ModalCloseButton />
        <FormProvider {...hForm}>
          <form onSubmit={hForm.handleSubmit(handleOnFormSubmit)}>
            <ModalBody>
              <RecoInputs />
              <GroupSelector
                name="sGroup"
                label={t("form:species_groups")}
                options={speciesGroupOptions}
                isRequired={false}
              />
              <LocationPicker isRequired={false} />
              <DateInputs isRequired={false} />

              {customFieldList && <ObservationCustomFieldForm fields={fields} />}
              <TraitsPicker name="facts" label={t("observation:traits")} />
              <UserGroups name="userGroupId" label={t("observation:post_to_groups")} />
            </ModalBody>

            <ModalFooter>
              <SubmitButton leftIcon={<CheckIcon />} mr={3}>
                {t("common:save")}
              </SubmitButton>
              <Button onClick={onClose}>{t("common:close")}</Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}
