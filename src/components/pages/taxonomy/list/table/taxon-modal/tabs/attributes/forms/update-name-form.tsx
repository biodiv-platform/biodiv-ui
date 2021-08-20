import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { axUpdateTaxonName } from "@services/taxonomy.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function UpdateNameForm({ onDone }) {
  const { modalTaxon, setModalTaxon } = useTaxonFilter();
  const { t } = useTranslation();

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        taxonName: Yup.string().required()
      })
    ),
    defaultValues: {
      taxonName: modalTaxon?.name
    }
  });

  const handleOnSubmit = async (values) => {
    const { success, data } = await axUpdateTaxonName({ ...values, taxonId: modalTaxon.id });
    if (success) {
      setModalTaxon(data);
      onDone();
      notification(t("taxon:modal.attributes.name.success"), NotificationType.Success);
    } else {
      notification(t("taxon:modal.attributes.name.error"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <TextBoxField
          name="taxonName"
          label={t("taxon:modal.attributes.name.title")}
          isRequired={true}
        />
        <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
