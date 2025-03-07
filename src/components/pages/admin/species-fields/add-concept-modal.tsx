import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function AddConceptModal({ isOpen, onClose, onSubmit }) {
  const { t } = useTranslation();

  const hForm = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(t("form:required"))
      })
    ),
    defaultValues: {
      name: ""
    }
  });

  const handleSubmit = (values) => {
    onSubmit(values);
    hForm.reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider {...hForm}>
          <form onSubmit={hForm.handleSubmit(handleSubmit)}>
            <ModalHeader>{t("admin:species_fields.add_concept")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TextBoxField 
                name="name" 
                label={t("admin:species_fields.concept_name")} 
                isRequired={true} 
              />
            </ModalBody>
            <ModalFooter>
              <SubmitButton leftIcon={<CheckIcon />} mr={3}>
                {t("common:save")}
              </SubmitButton>
              <Button variant="ghost" onClick={onClose}>
                {t("common:cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
} 