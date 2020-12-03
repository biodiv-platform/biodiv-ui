import TextBoxField from "@components/form/text";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function NewResourceForm({ form }) {
  const { t } = useTranslation();
  return (
    <>
      <TextBoxField
        name="title"
        isRequired={true}
        form={form}
        label={t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.TITLE")}
      />
      <TextBoxField
        name="moreLinks"
        form={form}
        label={t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.LINK")}
      />
      <ImageUploaderField
        form={form}
        label={t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.IMAGEURL")}
        name="fileName"
        resourcePath="observations"
      />
    </>
  );
}
