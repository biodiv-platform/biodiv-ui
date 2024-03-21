import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  GridItem,
  SimpleGrid
} from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { SwitchField } from "@components/form/switch";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageShowMinimal } from "@interfaces/pages";
import { axRemovePageGalleryImage, axUploadEditorPageResource } from "@services/pages.service";
import { translateOptions } from "@utils/i18n";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { PAGE_TYPE_OPTIONS, PAGE_TYPES } from "../data";
import usePages from "../sidebar/use-pages-sidebar";
import { PageGalleryField } from "./gallery-field";
import { SocialPreviewField } from "./social-preview";

const WYSIWYGField = dynamic(() => import("@components/form/wysiwyg"), { ssr: false });

interface PageFormProps {
  defaultValues: Partial<PageShowMinimal>;
  submitLabel: string;
  onSubmit;
  hideParentId: boolean;
}

export default function PageForm({
  defaultValues,
  submitLabel,
  onSubmit,
  hideParentId
}: PageFormProps) {
  const { t } = useTranslation();
  const { pages } = usePages();

  const [parentOptions, contentTypeOptions] = useMemo(
    () => [
      [
        { label: t("page:no_parent"), value: 0 },
        ...pages.map((p) => ({ label: `${p.title}`, value: p.id }))
      ],
      translateOptions(t, PAGE_TYPE_OPTIONS)
    ],
    [pages]
  );

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required(),
        pageType: Yup.string().required(),
        description: Yup.string().nullable(),
        galleryData: Yup.array().of(
          Yup.object().shape({
            id: Yup.mixed().nullable(),
            fileName: Yup.string().required()
          })
        ),
        url: Yup.string()
          .nullable()
          .when("pageType", {
            is: (v) => v === PAGE_TYPES.REDIRECT,
            then: Yup.string().required("URL is required")
          }),
        content: Yup.string()
          .nullable()
          .when("pageType", {
            is: (v) => v === PAGE_TYPES.CONTENT,
            then: Yup.string().required("Content is required")
          }),
        parentId: hideParentId ? Yup.number().notRequired() : Yup.number().required(),
        sticky: Yup.boolean().required(),
        showInFooter: Yup.boolean(),
        showInMenu: Yup.boolean(),
        allowComments: Yup.boolean().required()
      })
    ),
    defaultValues
  });

  const isPageTypeRedirect = hForm.watch("pageType") === PAGE_TYPES.REDIRECT;

  const getPageShowInMenu = (pages, id) => {
    const { showInMenu = true } = pages.find((page) => page.id === id) || {};
    return showInMenu;
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ md: 6 }} spacing={4}>
          <GridItem colSpan={4}>
            <TextBoxField name="title" label={t("page:form.title")} />
          </GridItem>
          <GridItem colSpan={2}>
            <SelectInputField
              name="pageType"
              label={t("page:form.type.title")}
              options={contentTypeOptions}
              shouldPortal={true}
            />
          </GridItem>
        </SimpleGrid>

        <Box hidden={isPageTypeRedirect}>
          <WYSIWYGField
            name="content"
            label={t("page:form.content")}
            uploadHandler={axUploadEditorPageResource}
          />
        </Box>

        <Box hidden={!isPageTypeRedirect}>
          <TextBoxField name="url" label={t("page:form.url")} />
        </Box>

        <Box hidden={isPageTypeRedirect}>
          <Accordion allowToggle>
            <AccordionItem
              mb={8}
              bg="white"
              border="1px solid var(--chakra-colors-gray-300)"
              borderRadius="md"
            >
              <AccordionButton _expanded={{ bg: "gray.100" }}>
                <Box flex={1} textAlign="left">
                  🖼️ {t("page:form.gallery")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Box hidden={isPageTypeRedirect}>
                  <PageGalleryField
                    name="galleryData"
                    label={t("page:form.gallery")}
                    onRemoveCallback={axRemovePageGalleryImage}
                  />
                </Box>
                <SocialPreviewField name="socialPreview" label={t("page:form.social_preview")} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
        <Accordion allowToggle>
          <AccordionItem
            mb={8}
            bg="white"
            border="1px solid var(--chakra-colors-gray-300)"
            borderRadius="md"
          >
            <AccordionButton _expanded={{ bg: "gray.100" }}>
              <Box flex={1} textAlign="left">
                📝 {t("page:form.meta_data")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <TextAreaField name="description" label={t("page:form.description")} />
              {!hideParentId && (
                <SelectInputField
                  name="parentId"
                  label={t("page:form.parent")}
                  options={parentOptions}
                  shouldPortal={true}
                />
              )}
              <SwitchField name="sticky" mb={2} label={t("page:form.is_sidebar")} />
              <SwitchField
                name="showInMenu"
                mb={2}
                label={t("page:form.is_menu")}
                disabled={!getPageShowInMenu(pages, defaultValues?.parentId)}
              />
              <SwitchField name="showInFooter" mb={2} label={t("page:form.is_footer")} />
              <SwitchField name="allowComments" mb={2} label={t("page:form.is_allow_comments")} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <SubmitButton>{submitLabel}</SubmitButton>
      </form>
    </FormProvider>
  );
}
