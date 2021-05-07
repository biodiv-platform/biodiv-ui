import { Button, ModalBody, ModalFooter } from "@chakra-ui/react";
import SubmitButton from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { AssetStatus } from "@interfaces/custom";
import { axUpdateSpeciesGalleryResources } from "@services/species.service";
import { nanoid } from "nanoid";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import useSpecies from "../../use-species";
import SpeciesFieldContainer from "./species-gallery-container";

export default function SpeciesGalleryForm({ resources, setResources, onClose }) {
  const { t } = useTranslation();
  const { species } = useSpecies();
  const initialResources = resources?.map(({ resource: r }) => ({
    ...r,
    caption: r.description,
    path: r.fileName,
    hashKey: nanoid(),
    status: AssetStatus.Uploaded,
    licenceId: r.licenseId?.toString(),
    isUsed: 1,
    rating: r.rating || 0
  }));

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        resources: Yup.array().of(
          Yup.object().shape({
            status: Yup.number().oneOf(
              [AssetStatus.Uploaded, null],
              t("OBSERVATION.EDIT_NOT_UPLOADED")
            )
          })
        )
      })
    ),
    defaultValues: {
      resources: initialResources
    }
  });

  const handleOnSubmit = async (values) => {
    const payload = values.resources.map((r) => ({
      path: r.path,
      url: r.url,
      type: r.type,
      caption: r.caption,
      rating: r.rating,
      licenceId: Number(r.licenceId),
      observationId: r?.observationId,
      resourcesId: r?.id
    }));

    const { success, data } = await axUpdateSpeciesGalleryResources(species.species.id, payload);
    if (success) {
      setResources(data);
      onClose();
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
      <ModalBody>
        <SpeciesFieldContainer name="resources" form={hForm} isCreate={false} />
      </ModalBody>
      <ModalFooter>
        <SubmitButton leftIcon={<CheckIcon />} form={hForm}>
          {t("SAVE")}
        </SubmitButton>
        <Button ml={4} leftIcon={<CrossIcon />} onClick={onClose}>
          {t("CANCEL")}
        </Button>
      </ModalFooter>
    </form>
  );
}
