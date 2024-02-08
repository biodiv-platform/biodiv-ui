import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SubmitButton } from "@components/form/submit-button";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { axEsUserAutoComplete } from "@services/auth.service";
import { axRequestTaxonPermission } from "@services/taxonomy.service";
import { TAXON_ROLES } from "@static/taxon";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export function TaxonPermissionRequestForm({ taxon, onClose, isAdmin }) {
  const { t } = useTranslation();

  const onUserQuery = async (q) => {
    const { data } = await axEsUserAutoComplete(q);
    return data.map((tag) => ({
      label: `${tag.name} (${tag.id})`,
      value: tag.id,
      version: tag.version
    }));
  };

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        role: Yup.string().required(),
        userId: isAdmin ? Yup.mixed().required() : Yup.number(),
        requestorMessage: Yup.string().required()
      })
    )
  });

  const handleOnSubmit = async ({ role, userId, requestorMessage }) => {
    const taxons = taxon.split(",");

    for (taxon of taxons) {
      const { success } = await axRequestTaxonPermission({
        taxonId: Number(taxon),
        userId,
        role,
        requestorMessage
      });
      if (success) {
        notification(t("taxon:request.success"), NotificationType.Success);
      } else {
        notification(t("taxon:request.failure"));
      }
    }
    console.warn("role,userId,taxons ", role, userId, taxons);

    onClose();
  };

  return (
    <ModalContent>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <ModalHeader>{isAdmin ? t("taxon:grant.title") : t("taxon:request.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SelectInputField
              name="role"
              label={t("taxon:role")}
              options={TAXON_ROLES}
              shouldPortal={true}
            />
            <TextAreaField
              name={"requestorMessage"}
              label={t("taxon:request.message")}
              placeholder={t("taxon:request.placeholder")}
              maxLength="200"
            />
            {isAdmin && (
              <SelectAsyncInputField
                name="userId"
                onQuery={onUserQuery}
                multiple={false}
                isClearable={false}
                label={t("taxon:request.user")}
                mb={0}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <SubmitButton leftIcon={<CheckIcon />}>
              {isAdmin ? t("taxon:grant.button") : t("taxon:request.button")}
            </SubmitButton>
            <Button ml={4} leftIcon={<CrossIcon />} onClick={onClose}>
              {t("common:cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </ModalContent>
  );
}
