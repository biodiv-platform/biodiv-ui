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
import { axUpdateSpeciesSynonym } from "@services/species.service";
import { axGetTaxonRanks } from "@services/taxonomy.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import useSpecies from "../use-species";

export default function SpeciesSynonymForm({ synonym, onUpdate, onClose }) {
  const { t } = useTranslation();
  const { species } = useSpecies();

  const [taxonRanks, setTaxonRanks] = useState([]);

  useEffect(() => {
    axGetTaxonRanks().then(({ data }) =>
      setTaxonRanks(
        data.map((rank) => ({
          label: rank.name,
          value: rank.name
        }))
      )
    );
  }, []);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(),
        rank: Yup.mixed().nullable(),
        dataSource: Yup.string().notRequired(),
        dataSourceId: Yup.string().notRequired()
      })
    ),
    defaultValues: {
      name: synonym.name,
      rank: synonym.rank,
      dataSource: synonym.viaDatasource,
      dataSourceId: synonym.nameSourceId
    }
  });

  const handleOnSubmit = async (values) => {
    const payload = { id: synonym.id, ...values };

    const { success, data } = await axUpdateSpeciesSynonym(species.species.id, payload);

    if (success) {
      onUpdate(data);
      notification(t("species:synonym.update.success"), NotificationType.Success);
      onClose();
    } else {
      notification(t("species:synonym.update.failure"));
    }
  };

  return (
    <ModalContent>
      {taxonRanks.length ? (
        <FormProvider {...hForm}>
          <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
            <ModalHeader>{t("species:edit_synonym")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TextBoxField name="name" label={t("species:synonym.form.name")} isRequired={true} />
              <SelectInputField
                name="rank"
                label={t("species:synonym.form.rank")}
                options={taxonRanks}
                isRequired={true}
              />
              <TextBoxField name="dataSource" label={t("species:synonym.form.datasource")} />
              <TextBoxField
                name="dataSourceId"
                label={t("species:synonym.form.datasource_id")}
                mb={0}
              />
            </ModalBody>
            <ModalFooter>
              <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
              <Button ml={3} leftIcon={<CrossIcon />} onClick={onClose}>
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
