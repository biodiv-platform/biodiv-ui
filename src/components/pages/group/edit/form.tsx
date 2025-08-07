import { Box, Button, Flex, SimpleGrid, Tabs, useDisclosure } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import { UserGroupEditData } from "@interfaces/userGroup";
import { axUserGroupUpdate } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Select from "react-select";
import * as Yup from "yup";

import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";

import AreaDrawField from "../common/area-draw-field";
import IconCheckboxField from "../common/icon-checkbox-field";
import ImageUploaderField from "../common/image-uploader-field";
import { STATIC_GROUP_PAYLOAD } from "../common/static";

interface IuserGroupEditProps {
  groupInfo: UserGroupEditData;
  userGroupId;
  habitats;
  speciesGroups;
  currentStep;
  languages;
  isAdmin;
}

export default function UserGroupEditForm({
  groupInfo,
  userGroupId,
  habitats,
  speciesGroups,
  currentStep = -1,
  languages,
  isAdmin
}: IuserGroupEditProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { languageId } = useGlobalState();

  const {
    neLatitude,
    neLongitude,
    swLatitude,
    swLongitude,
    translation,
    icon,
    habitatId,
    speciesGroupId,
    allowUserToJoin,
    webAddress
  } = groupInfo;

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        translation: Yup.array()
          .of(
            Yup.object({
              name: Yup.string()
                .required()
                .matches(/^[^/]*$/, "Name cannot contain '/'"),
              language: Yup.number().integer().required(),
              description: Yup.string()
            })
          )
          .required(),
        speciesGroupId: Yup.array().required(),
        habitatId: Yup.array().required(),
        spacialCoverage: Yup.object().shape({
          ne: Yup.array().required(),
          se: Yup.array().required()
        }),
        webAddress: Yup.string()
          .required("Web address is required")
          .matches(/^[^\s/]*$/, "Web address cannot contain '/' or spaces")
      })
    ),
    defaultValues: {
      translation,
      icon,
      habitatId,
      speciesGroupId,
      allowUserToJoin,
      spacialCoverage:`POLYGON ((${neLongitude} ${neLatitude},${neLongitude} ${swLatitude},${swLongitude} ${swLatitude},${swLongitude} ${neLatitude},${neLongitude} ${neLatitude}))`,
      webAddress
    }
  });

  const handleFormSubmit = async (values) => {
    const { spacialCoverage, ...otherValues } = values;

    const payload = {
      ...STATIC_GROUP_PAYLOAD,
      ...otherValues,
      languageId: values.languageId || languageId,
      neLatitude: spacialCoverage?.ne?.[1],
      neLongitude: spacialCoverage?.ne?.[0],
      swLatitude: spacialCoverage?.se?.[1],
      swLongitude: spacialCoverage?.se?.[0]
    };

    const { success } = await axUserGroupUpdate(payload, userGroupId);
    if (success) {
      notification(t("group:edit.success"), NotificationType.Success);
      router.push(`/group/${values.webAddress}`, false, {}, false);
    } else {
      notification(t("group:edit.error"));
    }
  };

  const languageMap = Object.fromEntries(translation.map((item, index) => [item.language, index]));

  const [translationSelected, setTranslationSelected] = useState<number>(
    languageId in languageMap ? languageMap[languageId] : 0
  );
  const [langId, setLangId] = useState(0);
  const { open, onClose, onOpen } = useDisclosure();

  const handleAddTranslation = () => {
    const currentList = hForm.getValues("translation");

    const newEntry = { name: "", language: langId, description: "" };
    hForm.setValue("translation", [...currentList, newEntry]);
    languageMap[langId] = currentList.length;
    setTranslationSelected(currentList.length);
  };

  return (
    <FormProvider {...hForm}>
      {(currentStep == -1 || currentStep == "group:basic_details") && (
        <>
          <DialogRoot open={open} onOpenChange={onClose}>
            <DialogBackdrop />
            <DialogContent>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleAddTranslation();
                  setLangId(0);
                  onClose();
                }}
              >
                <DialogHeader> {t("common:create_form.add_translation_button")}</DialogHeader>
                <DialogBody>
                  <Box>
                    <Field
                      mb={2}
                      required={true}
                      htmlFor="name"
                      label={t("common:create_form.language")}
                    >
                      {
                        <Select
                          id="langId"
                          inputId="langId"
                          name="langId"
                          placeholder={t("common:create_form.language_placeholder")}
                          onChange={(o: { value: number; label: string }) => {
                            setLangId(o.value);
                          }}
                          components={{
                            IndicatorSeparator: () => null
                          }}
                          options={languages
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((lang) => ({
                              value: lang.id,
                              label: lang.name
                            }))}
                          isSearchable={true} // Enables search
                        />
                      }
                    </Field>
                  </Box>
                </DialogBody>
                <DialogFooter>
                  <Button
                    mr={3}
                    onClick={() => {
                      setLangId(0);
                      onClose();
                    }}
                    variant="subtle"
                  >
                    {t("common:create_form.cancel")}
                  </Button>
                  <Button colorPalette="blue" type="submit">
                    {t("common:create_form.create")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </DialogRoot>
          <Flex justify="flex-end" width="100%" mb={4} onClick={onOpen}>
            <Button colorPalette="green">{t("common:create_form.add_translation_button")}</Button>
          </Flex>
          <Tabs.Root
            overflowX="auto"
            mb={4}
            bg="gray.100"
            rounded="md"
            value={`${translationSelected}`}
            variant={"plain"}
            onValueChange={({ value }) => setTranslationSelected(Number(value))}
          >
            <Tabs.List>
              {hForm.getValues().translation.map((t, index) => (
                <Tabs.Trigger
                  key={t.language}
                  value={`${index}`}
                  _selected={{ bg: "white", borderRadius: "4", boxShadow: "lg" }}
                  m={1}
                >
                  {languages.filter((lang) => lang.id === Number(t.language))[0].name}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        </>
      )}
      <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fadeInUp">
        {(currentStep == -1 || currentStep == "group:basic_details") && (
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={{ md: 4 }}>
            <Box gridColumn="1/4">
              <TextBoxField
                key={`name-${translationSelected}`}
                name={`translation.${translationSelected}.name`}
                isRequired={true}
                label={t("group:name")}
              />
              <TextBoxField
                key={"webAddress"}
                name="webAddress"
                isRequired={true}
                label={t("group:webAddress")}
                disabled={!isAdmin}
              />
              <RichTextareaField
                key={`description-${translationSelected}`}
                name={`translation.${translationSelected}.description`}
                label={t("form:description.title")}
              />
            </Box>
            <ImageUploaderField label="Logo" name="icon" />
          </SimpleGrid>
        )}
        {(currentStep == -1 || currentStep == "group:group_coverage") && (
          <>
            <IconCheckboxField
              name="speciesGroupId"
              label={t("common:species_coverage")}
              options={speciesGroups}
              type="species"
              isRequired={true}
            />
            <IconCheckboxField
              name="habitatId"
              label={t("common:habitats_covered")}
              options={habitats}
              type="habitat"
              isRequired={true}
            />
            <AreaDrawField
              label={t("group:spatial_coverge")}
              name="spacialCoverage"
              isRequired={true}
            />
          </>
        )}

        {(currentStep == "group:basic_details" || currentStep == "group:group_coverage") && (
          <SubmitButton mb={8}>{t("group:update")}</SubmitButton>
        )}
      </form>
    </FormProvider>
  );
}
