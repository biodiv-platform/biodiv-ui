import { TextBoxField } from "@components/form/text";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function NewResourceForm() {
  const { t } = useTranslation();

  return (
    <>
      <TextBoxField
        name="title"
        isRequired={true}
        label={t("group:homepage_customization.resources.title")}
      />
      <TextBoxField name="moreLinks" label={t("group:homepage_customization.resources.link")} />
      <ImageUploaderField
        label={t("group:homepage_customization.resources.imageurl")}
        name="fileName"
      />
    </>
  );
}
