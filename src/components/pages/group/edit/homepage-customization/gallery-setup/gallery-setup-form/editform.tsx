import { Box, Button, Image } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import { yupResolver } from "@hookform/resolvers/yup";
import { axEditGroupHomePageGallery } from "@services/usergroup.service";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import { NotificationType } from "@utils/notification";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";

import { galleryFieldValidationSchema } from "./common";

export default function GalleryEditForm({ setIsEdit, setGalleryList, editGalleryData }) {
  const { t } = useTranslation();
  const readMoreUIOptions = [
    { label: "link", value: "link" },
    { label: "button", value: "button" }
  ];
  const gallerySidebarBackgroundOptions = [
    { label: "opaque", value: "opaque" },
    { label: "translucent", value: "translucent" }
  ];

  const {
    id,
    ugId,
    title,
    fileName,
    customDescripition,
    moreLinks,
    displayOrder,
    observationId,
    readMoreUIType,
    readMoreText,
    gallerySidebar
  } = editGalleryData;

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(galleryFieldValidationSchema),
    defaultValues: {
      id,
      ugId,
      title,
      fileName,
      customDescripition,
      moreLinks,
      displayOrder,
      observationId,
      readMoreUIType,
      readMoreText,
      gallerySidebar
    }
  });

  const imgUrl = getResourceThumbnail(
    RESOURCE_CTX.OBSERVATION,
    fileName,
    RESOURCE_SIZE.LIST_THUMBNAIL
  );

  const handleFormSubmit = async (payload) => {
    const { success, data } = await axEditGroupHomePageGallery(ugId, id, payload);

    if (success) {
      notification(t("group:homepage_customization.update.success"), NotificationType.Success);
      setGalleryList(data.gallerySlider);
      setIsEdit(false);
    } else {
      notification(t("group:homepage_customization.update.failure"), NotificationType.Success);
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button m={3} type="button" onClick={() => setIsEdit(false)}>
            <LuArrowLeft />
            {t("group:homepage_customization.back")}
          </Button>
        </Box>
        <TextBoxField
          name="title"
          isRequired={true}
          label={t("group:homepage_customization.resources.title")}
        />
        <TextBoxField name="moreLinks" label={t("group:homepage_customization.resources.link")} />
        {observationId ? (
          <>
            <p> {t("group:homepage_customization.resources.observation_image_not_editable")} </p>
            <Image src={imgUrl} />
          </>
        ) : (
          <ImageUploaderField
            label={t("group:homepage_customization.resources.imageurl")}
            name="fileName"
          />
        )}
        <TextAreaField
          name="customDescripition"
          label={t("group:homepage_customization.table.description")}
        />

        <TextBoxField name="readMoreText" label="Read more button text" maxLength={30} />

        <SelectInputField
          name="readMoreUIType"
          label="Read more UI type"
          options={readMoreUIOptions}
          shouldPortal={true}
        />

        <SelectInputField
          name="gallerySidebar"
          label="Gallery sidebar background"
          options={gallerySidebarBackgroundOptions}
          shouldPortal={true}
        />

        <SubmitButton>{t("common:update")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
