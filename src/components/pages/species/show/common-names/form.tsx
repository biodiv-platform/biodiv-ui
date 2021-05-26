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
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { axUpdateSpeciesCommonName } from "@services/species.service";
import { axGetLangList } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import useSpecies from "../use-species";

export function SpeciesCommonNameForm({ commonName, onUpdate, onClose }) {
  const { t } = useTranslation();
  const { species } = useSpecies();

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
      taxonConceptId: species.species.taxonConceptId
    };

    const { success, data } = await axUpdateSpeciesCommonName(species.species.id, payload);

    if (success) {
      onUpdate(data);
      onClose();
      notification(t("SPECIES.COMMON_NAME.SAVE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("SPECIES.COMMON_NAME.SAVE.FAILURE"));
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
            <ModalHeader>{t("SPECIES.EDIT_NAME")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TextBoxField
                name="name"
                label={t("SPECIES.COMMON_NAME.FORM.NAME")}
                isRequired={true}
              />
              <SelectInputField
                name="languageId"
                label={t("SPECIES.COMMON_NAME.FORM.LANGUAGE")}
                options={languages}
                mb={0}
              />
            </ModalBody>
            <ModalFooter>
              <SubmitButton leftIcon={<CheckIcon />}>{t("SAVE")}</SubmitButton>
              <Button ml={4} leftIcon={<CrossIcon />} onClick={onClose}>
                {t("CANCEL")}
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
