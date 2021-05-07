import {
  Box,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@chakra-ui/react";
import SelectInputField from "@components/form/select";
import SubmitButton from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import DropzoneFieldContainer from "@components/pages/observation/create/form/uploader";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { AssetStatus } from "@interfaces/custom";
import { axUpdateSpeciesField, axUploadSpeciesEditorResource } from "@services/species.service";
import { DEFAULT_LICENSE, LICENSES_ARRAY } from "@static/licenses";
import notification, { NotificationType } from "@utils/notification";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import useSpecies from "../../../use-species";
import UserSelectField from "../user-edit-input";
import ReferencesField from "./references-field";

const WYSIWYGField = dynamic(() => import("@components/form/wysiwyg"), { ssr: false });

export default function SpeciesFieldEditForm({ initialValue, onSave, onCancel }) {
  const { t } = useTranslation();
  const { user } = useGlobalState();
  const { species } = useSpecies();

  const referencesOnly = initialValue.referencesOnly;

  const initialContributors = useMemo(() => {
    let hasCurrentUser = false;

    const contributors = initialValue.contributor.map((c) => {
      if (c.id === user.id) {
        hasCurrentUser = true;
      }
      return { label: c.name, value: c.id };
    });
    return hasCurrentUser ? contributors : [...contributors, { label: user.name, value: user.id }];
  }, [initialValue.contributor]);

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        sfDescription: Yup.string().required(),
        attributions: Yup.string().required(),
        licenseId: Yup.mixed().required(),
        contributorIds: Yup.array().min(1).required(),
        references: Yup.array().of(
          Yup.object().shape({
            id: Yup.mixed(),
            title: Yup.string().required(),
            url: Yup.string()
          })
        ),
        speciesFieldResource: Yup.array().nullable()
      })
    ),
    defaultValues: {
      sfDescription: initialValue.fieldData.description,
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
          licenceId: r.resource.licenseId?.toString(),
          isUsed: 1,
          rating: r.resource.rating || 0
        })) || [],
      ...(referencesOnly
        ? { sfDescription: "dummy", licenseId: DEFAULT_LICENSE, attributions: "dummy" }
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
        rating: r.rating,
        licenceId: r.licenceId
      }))
    };

    const { success, data } = await axUpdateSpeciesField(species.species.id, payload);

    if (success) {
      onSave(data);
      notification(t("SPECIES.FIELD.UPDATE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("SPECIES.FIELD.UPDATE.FAILURE"));
    }
  };

  return (
    <ModalContent>
      <form onSubmit={hForm.handleSubmit(handleOnSave)}>
        <ModalHeader>{t("SPECIES.FIELD.MANAGE")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={3} minH="300px" bg="gray.200" borderRadius="md" data-hidden={referencesOnly}>
            <WYSIWYGField
              name="sfDescription"
              key="xo"
              form={hForm}
              uploadHandler={axUploadSpeciesEditorResource}
            />
          </Box>
          <TextBoxField
            hidden={referencesOnly}
            name="attributions"
            label={t("SPECIES.ATTRIBUTIONS")}
            isRequired={true}
            form={hForm}
          />
          <UserSelectField
            name="contributorIds"
            label={t("SPECIES.CONTRIBUTORS")}
            isRequired={true}
            form={hForm}
          />
          <SelectInputField
            hidden={referencesOnly}
            name="licenseId"
            label={t("DOCUMENT.LICENSE")}
            form={hForm}
            isRequired={true}
            options={LICENSES_ARRAY}
          />
          <ReferencesField name="references" label={t("SPECIES.REFERENCES")} form={hForm} />
          <DropzoneFieldContainer
            hidden={referencesOnly}
            name="speciesFieldResource"
            form={hForm}
            isCreate={false}
          />
        </ModalBody>
        <ModalFooter>
          <SubmitButton form={hForm} leftIcon={<CheckIcon />} children={t("SAVE")} />
          <Button ml={4} leftIcon={<CrossIcon />} onClick={onCancel}>
            {t("CANCEL")}
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
