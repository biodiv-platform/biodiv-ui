import { Button, CloseButton, Dialog, Link, Portal } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SubmitButton } from "@components/form/submit-button";
import { TextAreaField } from "@components/form/textarea";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import DownloadIcon from "@icons/download";
import { Role } from "@interfaces/custom";
import { axGetObservationMapData } from "@services/observation.service";
import { hasAccess, waitForAuth } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuExternalLink } from "react-icons/lu";
import * as Yup from "yup";

import CheckboxGroupField from "./checkbox-group-field";
import { OBSERVATION_FILTERS } from "./filters";

const getFilterOptions = (options) =>
  options.map((name) => ({ value: name.split("|")[0], label: name.split("|")[0] }));

export default function DownloadObservationDataModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useGlobalState();
  const { observationData, filter } = useObservationFilter();
  const traits = Object.keys(observationData.ag.groupTraits || {});
  const customFields = Object.keys(observationData.ag.groupCustomField || {});
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
        notes: Yup.string().required(),
        view: Yup.boolean().nullable()
      })
    ),
    defaultValues: {
      core: OBSERVATION_FILTERS[0].options.map(({ value }) => value),
      taxonomic: [],
      temporal: [],
      spatial: [],
      misc: [],
      traits: [],
      customfields: [],
      view: false
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
      view: values.view ? "resources_csv_download" : "csv_download"
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
          <Link href="/user/download-logs">
            {t("header:menu_secondary.more.download_logs")} <LuExternalLink />
          </Link>
        </>,
        NotificationType.Success
      );
      onClose();
    } else {
      notification(t("observation:download.error"));
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} size="xl" scrollBehavior="outside">
      <Portal>
        <Dialog.Backdrop>
          <Dialog.Positioner>
            <Dialog.Content hidden={isHidden}>
              <FormProvider {...hForm}>
                <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
                  <Dialog.Header fontSize={"xl"} fontWeight={"bold"}>
                    ☑️ {t("observation:download.modal.title")}
                  </Dialog.Header>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                  <Dialog.Body>
                    {OBSERVATION_FILTERS.map((f) => (
                      <CheckboxGroupField {...f} key={f.name} />
                    ))}
                    <CheckboxGroupField
                      name="traits"
                      label="Traits"
                      options={getFilterOptions(traits)}
                    />
                    {
                      <CheckboxGroupField
                        name="customfields"
                        label="Custom Fields"
                        options={getFilterOptions(customFields)}
                      />
                    }
                    <TextAreaField
                      name="notes"
                      label={t("observation:download.modal.note")}
                      hint={t("observation:download.modal.note_hint")}
                      isRequired={true}
                    />
                    <CheckboxField
                      hidden={!hasAccess([Role.Admin])}
                      label="Download as Resource Dataset"
                      name="view"
                    />
                  </Dialog.Body>

                  <Dialog.Footer>
                    <SubmitButton leftIcon={<DownloadIcon />}>
                      {t("observation:download.title")}
                    </SubmitButton>
                    <Button ml={3} onClick={onClose} variant={"subtle"}>
                      {t("common:cancel")}
                    </Button>
                  </Dialog.Footer>
                </form>
              </FormProvider>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Backdrop>
      </Portal>
    </Dialog.Root>
  );
}
