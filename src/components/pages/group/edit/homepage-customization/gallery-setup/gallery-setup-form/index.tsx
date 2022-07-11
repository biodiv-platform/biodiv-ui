import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Switch, Text } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { galleryFieldValidationSchema } from "./common";
import ExsistingResourceForm from "./exsisting-resource-form";
import NewResourceForm from "./new-resource-form";

interface IGallerySetupForm {
  title: string;
  customDescripition: string;
  fileName: string;
  moreLinks: string;
  observationId: number;
  authorId?: string;
  authorName?: string;
  profilePic?: string;
  options?: any[];
}

export default function GallerySetupFrom({ isCreate, galleryList, setGalleryList }) {
  const { t } = useTranslation();
  const [imagePicker, setImagePicker] = useState<boolean>(true);
  const [defaultValues, setDefaultValues] = useState<IGallerySetupForm | any>();

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(galleryFieldValidationSchema),
    defaultValues
  });

  const handleFormSubmit = (value) => {
    const payload = {
      authorId: defaultValues?.authorInfo?.id,
      authorName: defaultValues?.authorInfo?.name,
      authorImage: defaultValues?.authorInfo?.profilePic,
      ...value
    };
    setGalleryList([...galleryList, payload]);
    isCreate(false);
  };

  const handleChange = () => {
    setImagePicker(!imagePicker);
  };

  useEffect(() => {
    hForm.reset(defaultValues);
  }, [defaultValues]);

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button m={3} type="button" onClick={() => isCreate(false)} leftIcon={<ArrowBackIcon />}>
            {t("group:homepage_customization.back")}
          </Button>
          <Flex alignItems="center">
            <Text m={3}>{t("group:homepage_customization.resources.new_image")}</Text>
            <Switch onChange={handleChange} />
            <Text m={3}>{t("group:homepage_customization.resources.observation_image")}</Text>
          </Flex>
        </Box>
        {imagePicker ? (
          <NewResourceForm />
        ) : (
          <ExsistingResourceForm
            defaultValues={defaultValues}
            setDefaultValues={setDefaultValues}
          />
        )}
        <TextAreaField
          name="customDescripition"
          label={t("group:homepage_customization.table.description")}
        />
        <SubmitButton>{t("group:homepage_customization.gallery_setup.create")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
