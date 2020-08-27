import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/core";
import SubmitButton from "@components/form/submit-button";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import { yupResolver } from "@hookform/resolvers";
import useGlobalState from "@hooks/useGlobalState";
import useObservationFilter from "@hooks/useObservationFilter";
import { axDownloadFilteredObservations } from "@services/observation.service";
import { waitForAuth } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import CheckboxGroupField from "./checkbox-group-field";
import { OBSERVATION_FILTERS } from "./filters";

const getFilterOptions = (options) =>
  options.map(({ name, values }) => ({ value: values || name, label: name }));

export default function DownloadObservationDataModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const {
    user: { id: authorid },
    isLoggedIn
  } = useGlobalState();
  const { customFields, traits, filter } = useObservationFilter();
  const [isHidden, setIsHidden] = useState(false);

  const hForm = useForm<any>({
    mode: "onSubmit",
    resolver: yupResolver(
      Yup.object().shape({
        core: Yup.array(),
        taxonomic: Yup.array(),
        temporal: Yup.array(),
        spatial: Yup.array(),
        misc: Yup.array(),
        traits: Yup.array(),
        customfields: Yup.array(),
        notes: Yup.string().required()
      })
    ),
    defaultValues: {
      core: OBSERVATION_FILTERS[0].options.map(({ value }) => value),
      taxonomic: [],
      temporal: [],
      spatial: [],
      misc: [],
      traits: [],
      customfields: []
    }
  });

  /**
   * This will take object containing array values to comma seprated string
   *
   * @param {*} values
   * @returns
   */
  const normalizeValues = (values) => {
    return Object.entries(values).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value.toString() }),
      {}
    );
  };

  const handleOnSubmit = async (values) => {
    if (isLoggedIn) {
      setIsHidden(true);
      await waitForAuth();
      setIsHidden(false);
    }

    const params = {
      authorid,
      ...filter,
      ...normalizeValues(values)
    };

    const { success } = await axDownloadFilteredObservations(params);
    if (success) {
      notification(t("OBSERVATION.DOWNLOAD.SUCCESS"), NotificationType.Success);
      onClose();
    } else {
      notification(t("OBSERVATION.DOWNLOAD.ERROR"));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <ModalOverlay />
        <ModalContent hidden={isHidden}>
          <ModalHeader>☑️ {t("OBSERVATION.DOWNLOAD.MODAL.TITLE")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {OBSERVATION_FILTERS.map((filter) => (
              <CheckboxGroupField {...filter} key={filter.name} form={hForm} />
            ))}
            <CheckboxGroupField
              name="traits"
              label="Traits"
              options={getFilterOptions(traits)}
              form={hForm}
            />
            <CheckboxGroupField
              name="customfields"
              label="Custom Fields"
              options={getFilterOptions(customFields)}
              form={hForm}
            />
            <TextAreaField
              name="notes"
              label={t("OBSERVATION.DOWNLOAD.MODAL.NOTE")}
              hint={t("OBSERVATION.DOWNLOAD.MODAL.NOTE_HINT")}
              form={hForm}
              isRequired={true}
              mb={0}
            />
          </ModalBody>

          <ModalFooter>
            <SubmitButton leftIcon="download" form={hForm}>
              {t("OBSERVATION.DOWNLOAD.TITLE")}
            </SubmitButton>
            <Button ml={3} onClick={onClose}>
              {t("CANCEL")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
