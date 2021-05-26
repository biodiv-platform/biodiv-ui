import { Button, Flex } from "@chakra-ui/react";
import { TextBoxField } from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import { axGetObservationById } from "@services/observation.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useFormContext } from "react-hook-form";

import IconRadioField from "./icon-radio-field";

export default function ExsistingResourceForm({ defaultValues, setDefaultValues }) {
  const form = useFormContext();
  const { t } = useTranslation();

  const handleObservationLink = async () => {
    const observationId = form.getValues("observationId");
    const {
      success,
      data: { recoIbp, authorInfo, observationResource }
    } = await axGetObservationById(observationId);
    if (success) {
      setDefaultValues({
        authorInfo,
        observationId,
        moreLinks: `observation/show/${observationId}`,
        title: recoIbp?.scientificName || t("OBSERVATION.UNKNOWN"),
        fileName: observationResource[0]?.resource?.fileName,
        options: observationResource.map((item) => ({ value: item?.resource?.fileName }))
      });
    } else {
      setDefaultValues({});
      notification(t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.ERROR"), NotificationType.Error);
    }
  };

  return (
    <>
      <Flex mb={4} alignItems="flex-end">
        <TextBoxField
          name="observationId"
          isRequired={true}
          mb={0}
          label={t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.OBS_ID")}
        />
        <Button ml={2} onClick={handleObservationLink}>
          {t("SEARCH")}
        </Button>
      </Flex>
      {defaultValues && (
        <>
          <TextBoxField
            name="title"
            isRequired={true}
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.TITLE")}
          />
          <TextBoxField
            name="moreLinks"
            isRequired={true}
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.LINK")}
          />
          <IconRadioField
            name="fileName"
            label={t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.IMAGEURL")}
            options={defaultValues?.options}
          />
        </>
      )}
    </>
  );
}
