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
import ExternalBlueLink from "@components/@core/blue-link/external";
import { SubmitButton } from "@components/form/submit-button";
import { TextAreaField } from "@components/form/textarea";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import DownloadIcon from "@icons/download";
import { axGetObservationMapData } from "@services/observation.service";
import { waitForAuth } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import CheckboxGroupField from "./checkbox-group-field";
import { OBSERVATION_FILTERS } from "./filters";

const getFilterOptions = (options) => options.map(({ name }) => ({ value: name, label: name }));

export default function DownloadObservationDataModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useGlobalState();
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
      (acc, [key, value]: any) => ({ ...acc, [key]: value.toString() }),
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
      authorId: user?.id,
      ...filter,
      ...normalizeValues(values),
      view: "csv_download"
    };

    const { success } = await axGetObservationMapData(
      params,
      filter?.location ? { location: filter?.location } : {},
      true
    );
    if (success) {
      notification(
        <>
          {t("observation:download.success")}{" "}
          <ExternalBlueLink href="/user/download-logs">
            {t("header:menu_secondary.more.download_logs")}
          </ExternalBlueLink>
        </>,
        NotificationType.Success
      );
      onClose();
    } else {
      notification(t("observation:download.error"));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <ModalOverlay>
            <ModalContent hidden={isHidden}>
              <ModalHeader>☑️ {t("observation:download.modal.title")}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {OBSERVATION_FILTERS.map((f) => (
                  <CheckboxGroupField {...f} key={f.name} />
                ))}
                <CheckboxGroupField
                  name="traits"
                  label="Traits"
                  options={getFilterOptions(traits)}
                />
                <CheckboxGroupField
                  name="customfields"
                  label="Custom Fields"
                  options={getFilterOptions(customFields)}
                />
                <TextAreaField
                  name="notes"
                  label={t("observation:download.modal.note")}
                  hint={t("observation:download.modal.note_hint")}
                  isRequired={true}
                  mb={0}
                />
              </ModalBody>

              <ModalFooter>
                <SubmitButton leftIcon={<DownloadIcon />}>
                  {t("observation:download.title")}
                </SubmitButton>
                <Button ml={3} onClick={onClose}>
                  {t("common:cancel")}
                </Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </form>
      </FormProvider>
    </Modal>
  );
}
