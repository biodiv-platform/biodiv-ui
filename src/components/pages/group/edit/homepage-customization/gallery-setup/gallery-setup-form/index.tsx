import { Box, Button, Flex, Switch, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import SubmitButton from "@components/form/submit-button";
import TextAreaField from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

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

  const hForm = useForm({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required(),
        customDescripition: Yup.string(),
        fileName: Yup.string().required(),
        observationId: Yup.number().nullable(),
        moreLinks: Yup.string().required(),
        options: Yup.array().nullable()
      })
    ),
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
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button m={3} type="button" onClick={() => isCreate(false)} leftIcon={<ArrowBackIcon />}>
          {t("GROUP.HOMEPAGE_CUSTOMIZATION.BACK")}
        </Button>
        <Flex alignItems="center">
          <Text m={3}>{t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.NEW_IMAGE")}</Text>
          <Switch onChange={handleChange} />
          <Text m={3}>{t("GROUP.HOMEPAGE_CUSTOMIZATION.RESOURCES.OBSERVATION_IMAGE")}</Text>
        </Flex>
      </Box>
      {imagePicker ? (
        <NewResourceForm form={hForm} />
      ) : (
        <ExsistingResourceForm
          form={hForm}
          defaultValues={defaultValues}
          setDefaultValues={setDefaultValues}
        />
      )}
      <TextAreaField
        name="customDescripition"
        label={t("GROUP.HOMEPAGE_CUSTOMIZATION.TABLE.DESCRIPTION")}
        form={hForm}
      />
      <SubmitButton form={hForm}>
        {t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY_SETUP.CREATE")}
      </SubmitButton>
    </form>
  );
}
