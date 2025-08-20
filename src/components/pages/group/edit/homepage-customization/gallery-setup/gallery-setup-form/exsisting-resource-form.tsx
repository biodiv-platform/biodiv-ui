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
      setDefaultValues({
        authorInfo,
        observationId,
        moreLinks: `observation/show/${observationId}`,
        title: recoIbp?.scientificName || t("common:unknown"),
        fileName: observationResource[0]?.resource?.fileName,
        options: observationResource.map((item) => ({ value: item?.resource?.fileName }))
      });
    } else {
      setDefaultValues({});
      notification(t("group:homepage_customization.resources.error"), NotificationType.Error);
    }
  };

  return (
    <>
      <Flex mb={4} alignItems="flex-end">
        <TextBoxField
          key={`observationId`}
          name={`observationId`}
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
            name={`translations.${translation}.title`}
            isRequired={true}
            label={t("group:homepage_customization.resources.title")}
          />
          <TextBoxField
            key={`moreLinks`}
            name={`moreLinks`}
            isRequired={true}
            label={t("group:homepage_customization.resources.link")}
          />
          <IconRadioField
            name={`fileName`}
            label={t("group:homepage_customization.resources.imageurl")}
            options={form.getValues()?.options}
          />
        </>
      )}
    </>
  );
}
