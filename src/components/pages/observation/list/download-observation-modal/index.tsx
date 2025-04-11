import { Button } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
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
import * as Yup from "yup";

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot
} from "@/components/ui/drawer";

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
    <DrawerRoot open={isOpen} onOpenChange={onClose} size="lg">
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <DrawerBackdrop>
            <DrawerContent hidden={isHidden}>
              <DrawerHeader>☑️ {t("observation:download.modal.title")}</DrawerHeader>
              <DrawerCloseTrigger />
              <DrawerBody>
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
                />
                <CheckboxField
                  hidden={!hasAccess([Role.Admin])}
                  label="Download as Resource Dataset"
                  name="view"
                />
              </DrawerBody>

              <DrawerFooter>
                <SubmitButton leftIcon={<DownloadIcon />}>
                  {t("observation:download.title")}
                </SubmitButton>
                <Button ml={3} onClick={onClose}>
                  {t("common:cancel")}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </DrawerBackdrop>
        </form>
      </FormProvider>
    </DrawerRoot>
  );
}
