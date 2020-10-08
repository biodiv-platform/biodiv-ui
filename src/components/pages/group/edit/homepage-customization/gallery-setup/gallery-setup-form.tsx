import { Box, Button, Checkbox, SimpleGrid } from "@chakra-ui/core";
import RichTextArea from "@components/form/rich-textarea";
import SubmitButton from "@components/form/submit-button";
import ImageUploaderField from "@components/pages/group/common/image-uploader-field";
import useTranslation from "@hooks/use-translation";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { yupResolver } from "@hookform/resolvers";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import ImageMetaForm from "./image-meta-form";

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
        <Button m={3} type="button" onClick={() => isCreate(false)} leftIcon={<ArrowBackIcon />}>
          {t("GROUP.HOMEPAGE_CUSTOMIZATION.BACK")}
        </Button>
        <Checkbox defaultIsChecked onChange={handleChange}>
          {t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY_SETUP.SHOW_IMAGE_UPLOAD")}
        </Checkbox>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
        <ImageMetaForm form={hForm} imagePicker={imagePicker} />
        {imagePicker && <ImageUploaderField form={hForm} label="Gallery Image" name="fileName" />}
      </SimpleGrid>
      <RichTextArea name="customDescripition" label="Description" form={hForm} />
      <SubmitButton form={hForm}>
        {t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY_SETUP.CREATE")}
      </SubmitButton>
    </form>
  );
}
