import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { axUpdateTaxonPosition } from "@services/taxonomy.service";
import { TAXON_POSITION } from "@static/taxon";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function UpdatePositionForm() {
  const { modalTaxon, setModalTaxon } = useTaxonFilter();
  const { t } = useTranslation();

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        position: Yup.string().required()
      })
    ),
    defaultValues: {
      position: modalTaxon?.position
    }
  });

  const handleOnStatusFormSubmit = async (values) => {
    const { success, data } = await axUpdateTaxonPosition({ ...values, taxonId: modalTaxon.id });
    if (success) {
      setModalTaxon(data);
      notification(t("taxon:modal.attributes.position.success"), NotificationType.Success);
    } else {
      notification(t("taxon:modal.attributes.position.error"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnStatusFormSubmit)}>
        <SelectInputField
          name="position"
          label={t("taxon:modal.attributes.position.title")}
          options={TAXON_POSITION}
          shouldPortal={true}
          isRequired={true}
        />
        <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
