import { SelectAsyncInputField } from "@components/form/select-async";
import useTranslation from "@hooks/use-translation";
import { axQueryDocumentTagsByText } from "@services/document.service";
import React from "react";

const onTagsQuery = async (q) => {
  const { data } = await axQueryDocumentTagsByText(q);
  return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
};

export default function TagsInput() {
  const { t } = useTranslation();

  return (
    <SelectAsyncInputField
      name="tags"
      label={t("DOCUMENT.TAGS.TITLE")}
      hint={t("OBSERVATION.TAGS_HINT")}
      multiple={true}
      onQuery={onTagsQuery}
    />
  );
}
