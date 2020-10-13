import { Button } from "@chakra-ui/core";
import SelectAsync from "@components/form/select-async";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import notification, { NotificationType } from "@utils/notification";
import { cleanTags } from "@utils/tags";
import React from "react";
import { useForm } from "react-hook-form";
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
      notification(t("OBSERVATION.TAGS_UPDATE_SUCCESS"), NotificationType.Success);
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
      <SelectAsync name="tags" form={hForm} multiple={true} onQuery={onTagsQuery} mb={2} />
      <Button size="sm" colorScheme="blue" aria-label="Save" type="submit">
        {t("SAVE")}
      </Button>
      <Button size="sm" ml={2} colorScheme="gray" aria-label="Cancel" onClick={onClose}>
        {t("CANCEL")}
      </Button>
    </form>
  );
}
