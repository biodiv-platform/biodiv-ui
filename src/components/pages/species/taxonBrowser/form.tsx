import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { axRequestTaxonPermission } from "@services/taxonomy.service";
import { TAXON_ROLES } from "@static/taxon";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export function TaxonPermissionRequestForm({ taxon, onClose }) {
  const { t } = useTranslation();

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        role: Yup.string().required()
      })
    )
  });

  const handleOnSubmit = async ({ role }) => {
    const taxons = taxon.split(",");

    for (taxon of taxons) {
      const { success } = await axRequestTaxonPermission({ taxonId: Number(taxon), role });
      if (success) {
        notification(t("TAXON.REQUEST.SUCCESS"), NotificationType.Success);
      } else {
        notification(t("TAXON.REQUEST.FAILURE"));
      }
    }

    onClose();
  };

  return (
    <ModalContent>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <ModalHeader>{t("TAXON.REQUEST.TITLE")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SelectInputField name="role" label={t("TAXON.ROLE")} options={TAXON_ROLES} mb={0} />
          </ModalBody>
          <ModalFooter>
            <SubmitButton leftIcon={<CheckIcon />}>{t("TAXON.REQUEST.BUTTON")}</SubmitButton>
            <Button ml={4} leftIcon={<CrossIcon />} onClick={onClose}>
              {t("CANCEL")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </ModalContent>
  );
}
