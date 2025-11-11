import { Box, Button, ColorPicker, HStack, parseColor, Portal, SimpleGrid } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SubmitButton } from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuArrowLeft } from "react-icons/lu";
import * as Yup from "yup";

import { RichTextareaField } from "@/components/form/rich-textarea";
import TranslationTab from "@/components/pages/common/translation-tab";
import { axEditAnnouncement } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

export default function AnnouncementEditForm({
  setIsEdit,
  announcementList,
  setAnnouncementList,
  editAnnouncementData,
  languages,
  index = 0
}) {
  const { t } = useTranslation();

  const { announcementId, enabled, translations } = editAnnouncementData;

  const [translationSelected, setTranslationSelected] = useState<number>(
    SITE_CONFIG.LANG.DEFAULT_ID
  );
  const [langId, setLangId] = useState(0);
  const [color, setColor] = useState(
    editAnnouncementData.color ? editAnnouncementData.color : "rgba(255,255,255,1)"
  );
  const [bgColor, setBgColor] = useState(
    editAnnouncementData.bgColor ? editAnnouncementData.bgColor : "rgba(26, 32, 44, 1)"
  );

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        enabled: Yup.boolean(), // Add your validation as needed
        translations: Yup.object().shape({})
      })
    ),
    defaultValues: {
      enabled,
      translations
    }
  });

  const handleAddTranslation = () => {
    hForm.setValue(`translations.${langId}`, "");
    setTranslationSelected(langId);
  };

  const handleFormSubmit = async (value) => {
    const payload = {
      color: color,
      bgColor: bgColor,
      ...value
    };
    const { success, data } = await axEditAnnouncement(announcementId, payload);
    if (success) {
      notification(t("admin:announcement.edit_success"), NotificationType.Success);
      setIsEdit(false);
      announcementList[index] = data;
      setAnnouncementList(announcementList);
    } else {
      notification(t("admin.announcement.edit_failure"), NotificationType.Error);
    }
  };

  return (
    <FormProvider {...hForm}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button m={3} type="button" onClick={() => setIsEdit(false)} variant={"subtle"}>
          <LuArrowLeft />
          {t("group:homepage_customization.back")}
        </Button>
      </Box>
      <TranslationTab
        values={Object.keys(hForm.getValues().translations)}
        setLangId={setLangId}
        languages={languages}
        handleAddTranslation={handleAddTranslation}
        translationSelected={translationSelected}
        setTranslationSelected={setTranslationSelected}
      />
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
        <RichTextareaField
          key={`${translationSelected}`}
          name={`translations.${translationSelected}`}
          label={t("form:description.title")}
        />

        {
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
            <ColorPicker.Root
              defaultValue={parseColor(color)}
              onValueChange={(v) => setColor(v.valueAsString)}
              mb={4}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>
                {t("group:homepage_customization.resources.text_color")}
              </ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Trigger p="2" width={"full"}>
                  <ColorPicker.ValueSwatch boxSize="10" width={"full"} />
                </ColorPicker.Trigger>
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="sm" variant="outline" />
                      <ColorPicker.Sliders />
                      <ColorPicker.ValueSwatch />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>

            <ColorPicker.Root
              defaultValue={parseColor(bgColor)}
              onValueChange={(v) => setBgColor(v.valueAsString)}
              mb={4}
              disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Label>
                {t("group:homepage_customization.resources.background_color")}
              </ColorPicker.Label>
              <ColorPicker.Control>
                <ColorPicker.Trigger p="2" width={"full"}>
                  <ColorPicker.ValueSwatch boxSize="10" width={"full"} />
                </ColorPicker.Trigger>
              </ColorPicker.Control>
              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content>
                    <ColorPicker.Area />
                    <HStack>
                      <ColorPicker.EyeDropper size="sm" variant="outline" />
                      <ColorPicker.Sliders />
                      <ColorPicker.ValueSwatch />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>
          </SimpleGrid>
        }

        <CheckboxField
          name="enabled"
          label={t("group:homepage_customization.table.enabled")}
          disabled={translationSelected != SITE_CONFIG.LANG.DEFAULT_ID}
        />

        <SubmitButton>{t("common:update")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
