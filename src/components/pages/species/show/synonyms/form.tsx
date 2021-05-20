import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner
} from "@chakra-ui/react";
import Select from "@components/form/select";
import SubmitButton from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { axUpdateSpeciesSynonym } from "@services/species.service";
import { axGetTaxonRanks } from "@services/taxonomy.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
      notification(t("SPECIES.SYNONYM.UPDATE.SUCCESS"), NotificationType.Success);
      onClose();
    } else {
      notification(t("SPECIES.SYNONYM.UPDATE.FAILURE"));
    }
  };

  return (
    <ModalContent>
      {taxonRanks.length ? (
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <ModalHeader>{t("SPECIES.EDIT_SYNONYM")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TextBoxField
              name="name"
              label={t("SPECIES.SYNONYM.FORM.NAME")}
              form={hForm}
              isRequired={true}
            />
            <Select
              name="rank"
              label={t("SPECIES.SYNONYM.FORM.RANK")}
              options={taxonRanks}
              isRequired={true}
              form={hForm}
            />
            <TextBoxField
              name="dataSource"
              label={t("SPECIES.SYNONYM.FORM.DATASOURCE")}
              form={hForm}
            />
            <TextBoxField
              name="dataSourceId"
              label={t("SPECIES.SYNONYM.FORM.DATASOURCE_ID")}
              form={hForm}
              mb={0}
            />
          </ModalBody>
          <ModalFooter>
            <SubmitButton leftIcon={<CheckIcon />} form={hForm}>
              {t("SAVE")}
            </SubmitButton>
            <Button ml={3} leftIcon={<CrossIcon />} onClick={onClose}>
              {t("CANCEL")}
            </Button>
          </ModalFooter>
        </form>
      ) : (
        <Spinner m={4} />
      )}
    </ModalContent>
  );
}
