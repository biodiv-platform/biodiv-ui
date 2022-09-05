import { Button } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import { yupResolver } from "@hookform/resolvers/yup";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function ContributorsEditor({
  queryFunc,
  updateFunc,
  contributors,
  setContributors,
  onClose,
  dataSheetId,
  type
}) {
  const { t } = useTranslation();

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        contributors: Yup.array().nullable()
      })
    ),
    defaultValues: { contributors }
  });

  const handleOnSubmit = async (values) => {
    const { success } = await updateFunc(values?.contributors, dataSheetId, type);
    if (success) {
      setContributors(values?.contributors);
      onClose();
      notification(`${type} updated successfully`, NotificationType.Success);
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <SelectAsyncInputField name="contributors" multiple={true} onQuery={queryFunc} mb={2} />
        <Button size="sm" colorScheme="blue" aria-label="Save" type="submit">
          {t("common:save")}
        </Button>
        <Button size="sm" ml={2} colorScheme="gray" aria-label="Cancel" onClick={onClose}>
          {t("common:cancel")}
        </Button>
      </form>
    </FormProvider>
  );
}
