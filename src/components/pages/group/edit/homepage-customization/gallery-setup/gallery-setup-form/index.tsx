import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SubmitButton } from "@components/form/submit-button";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";

import { Switch } from "@/components/ui/switch";

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
  truncated?: boolean;
}

export default function GallerySetupFrom({ setIsCreate, galleryList, setGalleryList }) {
  const { t } = useTranslation();
  const [imagePicker, setImagePicker] = useState<boolean>(true);
  const { currentGroup } = useGlobalState();
  const [defaultValues, setDefaultValues] = useState<IGallerySetupForm | any>(
    currentGroup.id ? undefined : { truncated: true }
  );
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
    setIsCreate(false);
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
          <Button m={3} type="button" onClick={() => setIsCreate(false)}>
            <LuArrowLeft />
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

        {!currentGroup.id && (
          <CheckboxField name="truncated" label={t("group:homepage_customization.table.enabled")} />
        )}
        <SubmitButton>{t("group:homepage_customization.gallery_setup.create")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
