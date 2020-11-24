import SelectInputField from "@components/form/select";
import SubmitButton from "@components/form/submit-button";
import SwitchField from "@components/form/switch";
import TextBoxField from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import { PageShowMinimal } from "@interfaces/pages";
import { axUploadEditorPageResource } from "@services/pages.service";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import usePagesSidebar from "../sidebar/use-pages-sidebar";

const WYSIWYGField = dynamic(import("@components/form/wysiwyg"), { ssr: false });

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
      { label: t("PAGE.NO_PARENT"), value: 0 },
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
    <form onSubmit={hForm.handleSubmit(onSubmit)}>
      <TextBoxField name="title" label={t("PAGE.FORM.TITLE")} form={hForm} />
      <TextBoxField name="description" label={t("PAGE.FORM.DESCRIPTION")} form={hForm} />
      <WYSIWYGField
        name="content"
        label={t("PAGE.FORM.CONTENT")}
        uploadHandler={axUploadEditorPageResource}
        form={hForm}
      />
      {!hideParentId && (
        <SelectInputField
          name="parentId"
          label={t("PAGE.FORM.PARENT")}
          options={parentOptions}
          form={hForm}
        />
      )}
      <SwitchField name="sticky" mb={2} label={t("PAGE.FORM.IS_SIDEBAR")} form={hForm} />
      <SubmitButton form={hForm}>{submitLabel}</SubmitButton>
    </form>
  );
}
