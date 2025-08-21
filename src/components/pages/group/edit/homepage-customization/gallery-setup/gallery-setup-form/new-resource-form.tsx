import { TextBoxField } from "@components/form/text";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function NewResourceForm({ translation }) {
  const { t } = useTranslation();

  return (
    <>
      <TextBoxField
        key={`title-${translation}`}
        name={`translations.${translation}.title`}
        isRequired={true}
        label={t("group:homepage_customization.resources.title")}
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
