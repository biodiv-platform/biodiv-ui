import { Box, Button } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import DropzoneFieldContainer from "@components/pages/observation/create/form/uploader";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { AssetStatus } from "@interfaces/custom";
import { axUploadEditorPageResource } from "@services/pages.service";
import { axUpdateSpeciesField } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader
} from "@/components/ui/dialog";

import useSpecies from "../../../use-species";
import UserSelectField from "../user-edit-input";
import ReferencesField from "./references-field";

const WYSIWYGField = dynamic(() => import("@components/form/wysiwyg"), { ssr: false });

export default function SpeciesFieldEditForm({ initialValue, onSave, onCancel }) {
  const { t } = useTranslation();
  const { user, languageId } = useGlobalState();
  const { species, licensesList } = useSpecies();
  const languagesList = useMemo(
    () => Object.values(SITE_CONFIG.LANG.LIST).map((l) => ({ value: l.ID, label: l.NAME })),
    []
  );

  const referencesOnly = initialValue.referencesOnly;

  const initialContributors = useMemo(() => {
    let hasCurrentUser = false;

    const contributors = initialValue.contributor.map((c) => {
      if (c.id === user.id) {
        hasCurrentUser = true;
      }
      return { label: c.name, value: c.id };
    });
    return hasCurrentUser
      ? contributors
      : [...contributors, { label: `${user.name} (${user.id})`, value: user.id }];
  }, [initialValue.contributor]);

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        sfDescription: Yup.string().required(),
        attributions: Yup.string().required(),
        languageId: Yup.mixed().required(),
        licenseId: Yup.mixed().required(),
        contributorIds: Yup.array().min(1).required(),
        references: Yup.array().of(
          Yup.object().shape({
            id: Yup.mixed(),
            title: Yup.string().required(),
            url: Yup.string().nullable()
          })
        ),
        speciesFieldResource: Yup.array().nullable()
      })
    ),
    defaultValues: {
      sfDescription: initialValue.fieldData.description,
      languageId: initialValue?.fieldData?.languageId || languageId,
      licenseId: initialValue.license.id.toString(),
      attributions: initialValue.attributions,
      contributorIds: initialContributors,
      references: initialValue.references || [],
      speciesFieldResource:
        initialValue.speciesFieldResource?.map((r) => ({
          ...r.resource,
          caption: r.resource.description,
          path: r.resource.fileName,
          hashKey: nanoid(),
          status: AssetStatus.Uploaded,
          licenseId: r.resource.licenseId?.toString(),
          isUsed: 1,
          rating: r.resource.rating || 0
        })) || [],
      ...(referencesOnly
        ? { sfDescription: "dummy", licenseId: SITE_CONFIG.LICENSE.DEFAULT, attributions: "dummy" }
        : {})
    }
  });

  const handleOnSave = async (values) => {
    const payload = {
      ...values,
      licenseId: Number(values.licenseId),
      isEdit: initialValue.isEdit,
      fieldId: initialValue.fieldId,
      speciesFieldId: initialValue?.id,
      sfStatus: initialValue.fieldData.status,
      references: values.references || [],
      contributorIds: values.contributorIds.map((contributor) => contributor.value),
      speciesFieldResource: values.speciesFieldResource.map((r) => ({
        path: r.path,
        url: r.url,
        type: r.type,
        caption: r.caption,
        contributor: r.contributor,
        rating: r.rating,
        licenseId: r.licenseId
      }))
    };

    const { success, data } = await axUpdateSpeciesField(species.species.id, payload);

    if (success) {
      onSave(data);
      notification(t("species:field.update.success"), NotificationType.Success);
    } else {
      notification(t("species:field.update.failure"));
    }
  };

  return (
    <DialogContent>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSave)}>
          <DialogHeader>{t("species:field.manage")}</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>
            <Box mb={3} minH="300px" bg="gray.200" borderRadius="md" data-hidden={referencesOnly}>
              <WYSIWYGField
                name="sfDescription"
                uploadHandler={axUploadEditorPageResource}
                key="xo"
              />
            </Box>
            <DropzoneFieldContainer
              hidden={referencesOnly}
              name="speciesFieldResource"
              isCreate={false}
              licensesList={licensesList}
            />
            <TextBoxField
              hidden={referencesOnly}
              name="attributions"
              label={t("species:attributions")}
              isRequired={true}
            />
            <UserSelectField
              name="contributorIds"
              label={t("species:contributors")}
              isRequired={true}
            />
            <SelectInputField
              hidden={referencesOnly}
              name="languageId"
              label={t("form:language")}
              isRequired={true}
              options={languagesList}
              shouldPortal={true}
            />
            <SelectInputField
              hidden={referencesOnly}
              name="licenseId"
              label={t("form:license")}
              isRequired={true}
              options={licensesList}
              shouldPortal={true}
            />
            <ReferencesField name="references" label={t("species:references")} />
          </DialogBody>
          <DialogFooter>
            <SubmitButton leftIcon={<CheckIcon />} children={t("common:save")} />
            <Button ml={4} onClick={onCancel}>
              <CrossIcon />
              {t("common:cancel")}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </DialogContent>
  );
}
