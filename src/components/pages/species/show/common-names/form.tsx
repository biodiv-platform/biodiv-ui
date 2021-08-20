import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner
} from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { axGetLangList } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export function SpeciesCommonNameForm({
  commonName,
  onUpdate,
  onClose,
  updateFunc,
  speciesId,
  taxonId
}) {
  const { t } = useTranslation();

  const [languages, setLanguages] = useState<any[]>([]);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(),
        languageId: Yup.mixed().nullable()
      })
    ),
    defaultValues: {
      name: commonName.name,
      languageId: commonName.languageId
    }
  });

  const handleOnSubmit = async (values) => {
    const payload = {
      id: commonName?.id,
      languageId: values.languageId,
      name: values.name,
      taxonConceptId: taxonId
    };

    const { success, data } = await updateFunc(speciesId, payload);

    if (success) {
      onUpdate(data);
      onClose();
      notification(t("species:common_name.save.success"), NotificationType.Success);
    } else {
      notification(t("species:common_name.save.failure"));
    }
  };

  useEffect(() => {
    axGetLangList().then(({ data }) =>
      setLanguages(data.map((l) => ({ label: l.name, value: l.id })))
    );
  }, []);

  return (
    <ModalContent>
      {languages.length ? (
        <FormProvider {...hForm}>
          <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
            <ModalHeader>{t("species:edit_name")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TextBoxField
                name="name"
                label={t("species:common_name.form.name")}
                isRequired={true}
              />
              <SelectInputField
                name="languageId"
                label={t("species:common_name.form.language")}
                options={languages}
                mb={0}
              />
            </ModalBody>
            <ModalFooter>
              <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
              <Button ml={4} leftIcon={<CrossIcon />} onClick={onClose}>
                {t("common:cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      ) : (
        <Spinner m={4} />
      )}
    </ModalContent>
  );
}
