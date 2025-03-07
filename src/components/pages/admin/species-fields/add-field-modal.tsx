import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function AddFieldModal({ isOpen, onClose, onSubmit, parentType, parentName }) {
  const { t } = useTranslation();
  
  const fieldType = parentType === "concept" ? "category" : "subcategory";

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
            <ModalHeader>
              {t(`admin:species_fields.add_${fieldType}`)}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {parentName && (
                <Text mb={4}>
                  {t(`admin:species_fields.adding_to_${parentType}`, { name: parentName })}
                </Text>
              )}
              <TextBoxField 
                name="name" 
                label={t(`admin:species_fields.${fieldType}_name`)} 
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