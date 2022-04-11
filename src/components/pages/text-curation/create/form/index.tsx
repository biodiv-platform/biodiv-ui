import { Box } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SelectMultipleInputField } from "@components/form/select-multiple";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axExtractAllParams } from "@services/curate.service";
import { axUserFilterSearch } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

import CSVDropzoneComponent from "./dropzone";

export default function TextCurationCreateForm() {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { user } = useGlobalState();
  const [headerOptions, setHeaderOptions] = useState([]);

  const hForm = useForm({
    resolver: yupResolver(
      yup.object().shape({
        filePath: yup.string().required(),
        sname: yup.array().required(),
        location: yup.array().required(),
        date: yup.array().required()
      })
    )
  });

  const handleOnFormSubmit = async (values) => {
    const payload = {
      ...values,
      userId: user.id
    };

    const { success, data } = await axExtractAllParams(payload);
    if (success) {
      notification(t("text-curation:create.success"), NotificationType.Success);
      router.push(`/text-curation/edit/${data}/`, true);
    } else {
      notification(t("text-curation:create.error"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnFormSubmit)}>
        <CSVDropzoneComponent name="filePath" setHeaders={setHeaderOptions} />

        <SelectMultipleInputField
          name="sname"
          label={t("text-curation:sci_name_columns")}
          options={headerOptions}
        />
        <SelectMultipleInputField
          name="location"
          label={t("text-curation:location_columns")}
          options={headerOptions}
        />
        <SelectMultipleInputField
          name="date"
          label={t("text-curation:date_columns")}
          options={headerOptions}
        />

        <ToggleablePanel icon="📃" title={t("text-curation:metadata")}>
          <Box p={4}>
            <TextBoxField name="title" label={t("form:title")} isRequired={true} />
            <TextAreaField
              name="summary"
              maxLength={255}
              label={t("text-curation:dataset_description")}
              isRequired={true}
            />
            <SelectAsyncInputField
              name="contributors"
              label={t("text-curation:contributors")}
              multiple={true}
              mb={0}
              onQuery={axUserFilterSearch}
            />
          </Box>
        </ToggleablePanel>

        <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
