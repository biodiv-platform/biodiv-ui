import { TextBoxField } from "@components/form/text";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function NewResourceForm({ translation, galleryId }) {
  const { t } = useTranslation();

  return (
    <>
      <TextBoxField
        key={`title-${translation}`}
        name={`translations.${translation}.title`}
        isRequired={true}
        label={t("group:homepage_customization.resources.title")}
        {...(galleryId != -1 && { maxLength: 20 })}
      />
      <TextBoxField
        key={`link`}
        name={`moreLinks`}
        label={t("group:homepage_customization.resources.link")}
        disabled={translation != SITE_CONFIG.LANG.DEFAULT_ID}
      />
      <ImageUploaderField
        key={`file`}
        label={t("group:homepage_customization.resources.imageurl")}
        name={`fileName`}
      />
    </>
  );
}
