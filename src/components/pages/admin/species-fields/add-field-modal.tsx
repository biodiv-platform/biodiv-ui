import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useFieldArray,useForm } from "react-hook-form";
import ReactSelect from "react-select";
import * as Yup from "yup";

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  parentType: string;
  parentName?: string;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({ isOpen, onClose, onSubmit, parentType, parentName }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0);
  
  const fieldType = parentType === "concept" ? "category" : "subcategory";

  const hForm = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        translations: Yup.array().of(
          Yup.object().shape({
            languageId: Yup.number().required(t("form:required")),
            header: Yup.string().required(t("form:required")),
            description: Yup.string().required(t("form:required")),
            urlIdentifier: Yup.string().required(t("form:required"))
          })
        ).min(1, t("form:at_least_one_translation"))
      })
    ),
    defaultValues: {
      translations: [
        {
          languageId: 205, // Default language ID
          header: "",
          description: "",
          urlIdentifier: ""
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: hForm.control,
    name: "translations"
  });

  const handleSubmit = (values) => {
    onSubmit(values);
    hForm.reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
              
              {/* Add Translation Button */}
              <Flex justify="flex-end" mb={4}>
                <Button
                  size="sm"
                  leftIcon={<AddIcon />}
                  onClick={() => {
                    append({
                      languageId: 205,
                      header: "",
                      description: "",
                      urlIdentifier: ""
                    });
                    setActiveTab(fields.length);
                  }}
                >
                  {t("admin:species_fields.add_translation")}
                </Button>
              </Flex>

              {/* Language Tabs */}
              <Flex mb={4} flexWrap="wrap" gap={2}>
                {fields.map((field, index) => (
                  <Button
                    key={field.id}
                    size="sm"
                    variant={activeTab === index ? "solid" : "outline"}
                    onClick={() => setActiveTab(index)}
                  >
                    {hForm.watch(`translations.${index}.languageId`) === 205 ? "English" : "French"}
                    {index > 0 && (
                      <IconButton
                        size="xs"
                        icon={<DeleteIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(index);
                          setActiveTab(0);
                        }}
                        ml={2}
                        aria-label="Remove translation"
                      />
                    )}
                  </Button>
                ))}
              </Flex>

              {/* Active Translation Form */}
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  display={activeTab === index ? "block" : "none"}
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                >
                  <ReactSelect
                    name={`translations.${index}.languageId`}
                    placeholder={t("admin:species_fields.language")}
                    options={[
                      { value: 205, label: "English" },
                      { value: 219, label: "French" }
                    ]}
                    value={
                      hForm.watch(`translations.${index}.languageId`) === 205
                        ? { value: 205, label: "English" }
                        : { value: 219, label: "French" }
                    }
                    onChange={(option) => {
                      if (option) {
                        hForm.setValue(`translations.${index}.languageId`, option.value);
                      }
                    }}
                  />

                  <TextBoxField 
                    name={`translations.${index}.header`}
                    label={t(`admin:species_fields.${fieldType}_name`)}
                    isRequired={true}
                  />
                  
                  <TextBoxField 
                    name={`translations.${index}.description`}
                    label={t("admin:species_fields.description")}
                    isRequired={true}
                  />
                  
                  <TextBoxField 
                    name={`translations.${index}.urlIdentifier`}
                    label={t("admin:species_fields.url_identifier")}
                    isRequired={true}
                  />
                </Box>
              ))}
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

export default AddFieldModal; 