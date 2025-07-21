import { Button } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import { yupResolver } from "@hookform/resolvers/yup";
import notification, { NotificationType } from "@utils/notification";
import { cleanTags } from "@utils/tags";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function TagsEditor({ objectId, queryFunc, updateFunc, tags, setTags, onClose }) {
  const { t } = useTranslation();

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        tags: Yup.array().nullable()
      })
    ),
    defaultValues: { tags }
  });

  const onTagsQuery = async (q) => {
    const { data } = await queryFunc(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  const handleOnSubmit = async (values) => {
    const { success } = await updateFunc({
      objectId,
      tags: cleanTags(values?.tags)
    });
    if (success) {
      setTags(values.tags);
      onClose();
      notification(t("form:tags_update_success"), NotificationType.Success);
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <SelectAsyncInputField name="tags" multiple={true} onQuery={onTagsQuery} mb={2} />
        <Button size="sm" colorPalette="blue" aria-label="Save" type="submit">
          {t("common:save")}
        </Button>
        <Button
          size="sm"
          ml={2}
          colorPalette="gray"
          aria-label="Cancel"
          onClick={onClose}
          variant={"subtle"}
        >
          {t("common:cancel")}
        </Button>
      </form>
    </FormProvider>
  );
}
