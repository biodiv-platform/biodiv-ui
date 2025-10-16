import { Box, Button, CloseButton, Dialog, Flex, IconButton, Portal, Text } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { axGetLangList } from "@services/utility.service";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import ReactSelect from "react-select";
import * as Yup from "yup";

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  parentType?: string;
  parentName?: string;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parentType = "root",
  parentName
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState(0);
  const [languages, setLanguages] = React.useState<{ value: number; label: string }[]>([]);

  React.useEffect(() => {
    const fetchLanguages = async () => {
      const response = await axGetLangList();
      if (response.success && response.data.length > 0) {
        const formattedLanguages = response.data.map((lang) => ({
          value: lang.id,
          label: lang.name
        }));
        setLanguages(formattedLanguages);
      } else {
        // Fallback to default languages if API fails
        // setLanguages([
        //   { value: 205, label: "English" },
        //   { value: 219, label: "French" }
        // ]);
      }
    };

    fetchLanguages();
  }, []);

  let fieldType;
  if (parentType === "root") {
    fieldType = "concept";
  } else if (parentType === "concept") {
    fieldType = "category";
  } else {
    fieldType = "subcategory";
  }

  const hForm = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        translations: Yup.array()
          .of(
            Yup.object().shape({
              languageId: Yup.number().required(t("form:required")),
              header: Yup.string().required(t("form:required")),
              description: Yup.string(),
              urlIdentifier: Yup.string()
            })
          )
          .min(1, t("form:at_least_one_translation"))
      })
    ),
    defaultValues: {
      translations: [
        {
          languageId: SITE_CONFIG.LANG.DEFAULT_ID, // Default language ID
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
    <Dialog.Root open={isOpen} size="xl" onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <FormProvider {...hForm}>
              <form onSubmit={hForm.handleSubmit(handleSubmit)}>
                <Dialog.Header fontSize={"xl"} fontWeight={"bold"}>
                  {t(`admin:species_fields.add_${fieldType}`)}
                </Dialog.Header>
                <Dialog.CloseTrigger />
                <Dialog.Body>
                  {parentName && (
                    <Text mb={4}>
                      {t(`admin:species_fields.adding_to_${parentType}`, { name: parentName })}
                    </Text>
                  )}

                  {/* Add Translation Button */}
                  <Flex justify="flex-end" mb={4}>
                    <Button
                      size="sm"
                      onClick={() => {
                        append({
                          languageId: SITE_CONFIG.LANG.DEFAULT_ID,
                          header: "",
                          description: "",
                          urlIdentifier: ""
                        });
                        setActiveTab(fields.length);
                      }}
                      variant={"subtle"}
                    >
                      <LuPlus />
                      {t("admin:species_fields.add_translation")}
                    </Button>
                  </Flex>

                  {/* Language Tabs */}
                  <Flex mb={4} flexWrap="wrap" gap={2}>
                    {fields.map((field, index) => (
                      <Button
                        key={field.id}
                        size="sm"
                        variant={activeTab === index ? "subtle" : "outline"}
                        onClick={() => setActiveTab(index)}
                      >
                        {languages.find(
                          (lang) => lang.value === hForm.watch(`translations.${index}.languageId`)
                        )?.label || "Unknown"}
                        {index > 0 && (
                          <IconButton
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(index);
                              setActiveTab(0);
                            }}
                            ml={2}
                            aria-label="Remove translation"
                            variant={"subtle"}
                          >
                            <LuTrash2 />
                          </IconButton>
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
                      <Box mb={4}>
                        <Text mb={2}>Select Language</Text>
                        <ReactSelect
                          name={`translations.${index}.languageId`}
                          placeholder={t("admin:species_fields.language")}
                          options={languages}
                          value={languages.find(
                            (lang) => lang.value === hForm.watch(`translations.${index}.languageId`)
                          )}
                          onChange={(option) => {
                            if (option) {
                              hForm.setValue(`translations.${index}.languageId`, option.value);
                            }
                          }}
                        />
                      </Box>

                      <TextBoxField
                        name={`translations.${index}.header`}
                        label={t(`admin:species_fields.${fieldType}_name`)}
                        isRequired={true}
                      />

                      <TextBoxField
                        name={`translations.${index}.description`}
                        label={t("admin:species_fields.description")}
                        isRequired={false}
                      />

                      <TextBoxField
                        name={`translations.${index}.urlIdentifier`}
                        label={t("admin:species_fields.url_identifier")}
                        isRequired={false}
                      />
                    </Box>
                  ))}
                </Dialog.Body>

                <Dialog.Footer>
                  <SubmitButton leftIcon={<CheckIcon />} mr={3}>
                    {t("common:save")}
                  </SubmitButton>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="subtle"> {t("common:cancel")}</Button>
                  </Dialog.ActionTrigger>
                </Dialog.Footer>
              </form>
            </FormProvider>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AddFieldModal;
