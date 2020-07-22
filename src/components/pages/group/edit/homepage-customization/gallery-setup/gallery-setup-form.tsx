import { Box, Button, Checkbox, SimpleGrid } from "@chakra-ui/core";
import RichTextArea from "@components/form/rich-textarea";
import SubmitButton from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import useTranslation from "@configs/i18n/useTranslation";
import { yupResolver } from "@hookform/resolvers";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

function GallerySetupComponent({ form, imagePicker }) {
  const formComponent = (
    <>
      <TextBoxField name="title" isRequired={true} form={form} label="Title" />
      <TextBoxField name="moreLinks" form={form} label="Link" />
      <TextBoxField name="authorId" type="number" form={form} label="Author Id" />
      {!imagePicker && <TextBoxField name="fileName" form={form} label="Observation Image" />}
    </>
  );
  return imagePicker ? <Box gridColumn="1/4">{formComponent}</Box> : formComponent;
}
export default function GallerySetupFrom({ isCreate, galleryList, setGalleryList }) {
  const { t } = useTranslation();
  const [imagePicker, setImagePicker] = useState<boolean>(true);

  const hForm = useForm({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required(),
        customDescripition: Yup.string(),
        fileName: Yup.string().required(),
        moreLinks: Yup.string().required(),
        authorId: Yup.number().nullable()
      })
    )
  });

  const handleFormSubmit = (value) => {
    setGalleryList([...galleryList, value]);
    isCreate(false);
  };

  const handleChange = () => {
    setImagePicker(!imagePicker);
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button m={3} type="button" onClick={() => isCreate(false)} leftIcon="arrow-back">
          {t("GROUP.HOMEPAGE_CUSTOMIZATION.BACK")}
        </Button>
        <Checkbox defaultIsChecked onChange={handleChange}>
          {t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY_SETUP.SHOW_IMAGE_UPLOAD")}
        </Checkbox>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
        <GallerySetupComponent form={hForm} imagePicker={imagePicker} />
        {imagePicker && <ImageUploaderField form={hForm} label="Gallery Image" name="fileName" />}
      </SimpleGrid>
      <RichTextArea name="customDescripition" label="Description" form={hForm} />
      <SubmitButton form={hForm}>
        {t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY_SETUP.CREATE")}
      </SubmitButton>
    </form>
  );
}
