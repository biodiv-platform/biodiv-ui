import { TextBoxField } from "@components/form/text";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function NewResourceForm({ translation }) {
  const { t } = useTranslation();
  const form = useFormContext();

  return (
    <>
      <TextBoxField
        key={`title-${translation}`}
        name={`${translation}.0.title`}
        isRequired={true}
        label={t("group:homepage_customization.resources.title")}
      />
      <TextBoxField
        key={`link-${translation}`}
        name={`${translation}.0.moreLinks`}
        label={t("group:homepage_customization.resources.link")}
        onChangeCallback={(e) => {
          const values = form.getValues();

          for (const langId in values) {
            const entry = values[langId]?.[0];
            if (entry) {
              form.setValue(`${langId}.0.moreLinks`,e.target.value);
            }
          }
        }}
      />
      <ImageUploaderField
        key={`file-${translation}`}
        label={t("group:homepage_customization.resources.imageurl")}
        name={`${translation}.0.fileName`}
        onChangeCallback={(value) => {
          const values = form.getValues();

          for (const langId in values) {
            const entry = values[langId]?.[0];
            if (entry) {
              form.setValue(`${langId}.0.fileName`, value);
            }
          }
        }}
      />
    </>
  );
}
