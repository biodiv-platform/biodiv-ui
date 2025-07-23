import { Button, Flex } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import { axGetObservationById } from "@services/observation.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";

import IconRadioField from "./icon-radio-field";

export default function ExsistingResourceForm({ defaultValues, setDefaultValues, translation }) {
  const form = useFormContext();
  const { t } = useTranslation();

  const handleObservationLink = async () => {
    const observationId = form.getValues(`${translation}.0.observationId`);
    const {
      success,
      data: { recoIbp, authorInfo, observationResource }
    } = await axGetObservationById(observationId);
    if (success) {
      const payload = Object.fromEntries(
        Object.entries(form.getValues()).map(([langId, entries]) => [
          langId,
          entries.map((entry) => ({
            ...entry,
            authorInfo,
            observationId,
            moreLinks: `observation/show/${observationId}`,
            title: recoIbp?.scientificName || t("common:unknown"),
            fileName: observationResource[0]?.resource?.fileName,
            options: observationResource.map((item) => ({ value: item?.resource?.fileName }))
          }))
        ])
      );
      setDefaultValues(payload);
    } else {
      setDefaultValues({});
      notification(t("group:homepage_customization.resources.error"), NotificationType.Error);
    }
  };

  return (
    <>
      <Flex mb={4} alignItems="flex-end">
        <TextBoxField
          key={`observationId-${translation}`}
          name={`${translation}.0.observationId`}
          isRequired={true}
          mb={0}
          label={t("group:homepage_customization.resources.obs_id")}
        />
        <Button ml={2} onClick={handleObservationLink} variant={"subtle"}>
          {t("common:search")}
        </Button>
      </Flex>
      {defaultValues && (
        <>
          <TextBoxField
            key={`title-${translation}`}
            name={`${translation}.0.title`}
            isRequired={true}
            label={t("group:homepage_customization.resources.title")}
          />
          <TextBoxField
            key={`moreLinks-${translation}`}
            name={`${translation}.0.moreLinks`}
            isRequired={true}
            label={t("group:homepage_customization.resources.link")}
            onChangeCallback={(e) => {
              const values = form.getValues();

              for (const langId in values) {
                const entry = values[langId]?.[0];
                if (entry) {
                  form.setValue(`${langId}.0.moreLinks`, e.target.value);
                }
              }
            }}
          />
          <IconRadioField
            name={`${translation}.0.fileName`}
            label={t("group:homepage_customization.resources.imageurl")}
            options={form.getValues()[translation][0]?.options}
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
      )}
    </>
  );
}
