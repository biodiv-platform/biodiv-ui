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
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { axUserSearch } from "@services/auth.service";
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
    const { data } = await axUserSearch(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        role: Yup.string().required(),
        userId: isAdmin ? Yup.number().required() : Yup.number()
      })
    )
  });

  const handleOnSubmit = async ({ role, userId }) => {
    const taxons = taxon.split(",");

    for (taxon of taxons) {
      const { success } = await axRequestTaxonPermission({ taxonId: Number(taxon), userId, role });
      if (success) {
        notification(t("taxon:request.success"), NotificationType.Success);
      } else {
        notification(t("taxon:request.failure"));
      }
    }

    onClose();
  };

  return (
    <ModalContent>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <ModalHeader>{t("taxon:request.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SelectInputField name="role" label={t("taxon:role")} options={TAXON_ROLES} />
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
            <SubmitButton leftIcon={<CheckIcon />}>{t("taxon:request.button")}</SubmitButton>
            <Button ml={4} leftIcon={<CrossIcon />} onClick={onClose}>
              {t("common:cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </ModalContent>
  );
}
