import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { SwitchField } from "@components/form/switch";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import { PageShowMinimal } from "@interfaces/pages";
import { axUploadEditorPageResource } from "@services/pages.service";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import usePagesSidebar from "../sidebar/use-pages-sidebar";

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
  const { pages } = usePagesSidebar();

  const parentOptions = useMemo(
    () => [
      { label: t("page:no_parent"), value: 0 },
      ...pages.map((p) => ({ label: `${p.title}`, value: p.id }))
    ],
    [pages]
  );

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().notRequired(),
        content: Yup.string().required(),
        parentId: hideParentId ? Yup.number().notRequired() : Yup.number().required(),
        sticky: Yup.boolean().required()
      })
    ),
    defaultValues
  });

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(onSubmit)}>
        <TextBoxField name="title" label={t("page:form.title")} />
        <TextBoxField name="description" label={t("page:form.description")} />
        <WYSIWYGField
          name="content"
          label={t("page:form.content")}
          uploadHandler={axUploadEditorPageResource}
        />
        {!hideParentId && (
          <SelectInputField
            name="parentId"
            label={t("page:form.parent")}
            options={parentOptions}
            shouldPortal={true}
          />
        )}
        <SwitchField name="sticky" mb={2} label={t("page:form.is_sidebar")} />
        <SubmitButton>{submitLabel}</SubmitButton>
      </form>
    </FormProvider>
  );
}
