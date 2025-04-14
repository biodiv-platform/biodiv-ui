import { Button } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { AssetStatus } from "@interfaces/custom";
import { axUpdateSpeciesGalleryResources } from "@services/species.service";
import { nanoid } from "nanoid";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { DialogBody, DialogFooter } from "@/components/ui/dialog";

import useSpecies from "../../use-species";
import SpeciesFieldContainer from "./species-gallery-container";

export default function SpeciesGalleryForm({ resources, setResources, onClose }) {
  const { t } = useTranslation();
  const { species, licensesList } = useSpecies();
  const initialResources = resources?.map(({ resource: r }) => ({
    ...r,
    caption: r.description,
    path: r.fileName,
    hashKey: nanoid(),
    status: AssetStatus.Uploaded,
    licenseId: r.licenseId?.toString(),
    isUsed: 1,
    rating: r.rating || 0
  }));

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        resources: Yup.array().of(
          Yup.object().shape({
            status: Yup.number().oneOf([AssetStatus.Uploaded, null], t("common:edit_not_uploaded"))
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
      contributor: r.contributor,
      rating: r.rating,
      licenseId: Number(r.licenseId),
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
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <DialogBody>
          <SpeciesFieldContainer
            name="resources"
            licensesList={licensesList}
            form={hForm}
            isCreate={false}
          />
        </DialogBody>
        <DialogFooter>
          <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
          <Button ml={4} onClick={onClose}>
            <CrossIcon />
            {t("common:cancel")}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
