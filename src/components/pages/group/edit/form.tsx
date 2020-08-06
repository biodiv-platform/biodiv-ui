import { Box, SimpleGrid } from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import CheckboxField from "@components/form/checkbox";
import RichTextareaField from "@components/form/rich-textarea";
import SubmitButton from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import useTranslation from "@configs/i18n/useTranslation";
import { UserGroupEditData } from "@interfaces/userGroup";
import { axUserGroupUpdate } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as Yup from "yup";

import AreaDrawFieldProps from "../common/area-draw-field";
import IconCheckboxField from "../common/icon-checkbox-field";
import ImageUploaderField from "../common/image-uploader-field";
import { STATIC_GROUP_PAYLOAD } from "../common/static";

interface IuserGroupEditProps {
  groupInfo: UserGroupEditData;
  userGroupId;
  habitats;
  speciesGroups;
}

export default function UserGroupEditForm({
  groupInfo,
  userGroupId,
  habitats,
  speciesGroups
}: IuserGroupEditProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();

  const {
    neLatitude,
    neLongitude,
    swLatitude,
    swLongitude,
    name,
    description,
    icon,
    habitatId,
    speciesGroupId,
    allowUserToJoin
  } = groupInfo;

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(),
        speciesGroupId: Yup.array().required(),
        habitatId: Yup.array().required(),
        spacialCoverage: Yup.object().shape({
          ne: Yup.array().required(),
          se: Yup.array().required()
        })
      })
    ),
    defaultValues: {
      name,
      description,
      icon,
      habitatId,
      speciesGroupId,
      allowUserToJoin,
      spacialCoverage: `${neLongitude},${neLatitude},${neLongitude},${swLatitude},${swLongitude},${swLatitude},${swLongitude},${neLatitude},${neLongitude},${neLatitude}`
    }
  });

  const handleFormSubmit = async (values) => {
    const { spacialCoverage, ...otherValues } = values;

    const payload = {
      ...STATIC_GROUP_PAYLOAD,
      ...otherValues,
      neLatitude: spacialCoverage?.ne?.[1],
      neLongitude: spacialCoverage?.ne?.[0],
      swLatitude: spacialCoverage?.se?.[1],
      swLongitude: spacialCoverage?.se?.[0]
    };

    const { success, data } = await axUserGroupUpdate(payload, userGroupId);
    if (success) {
      notification(t("GROUP.EDIT.SUCCESS"), NotificationType.Success);
      router.push(`/group/${data.name}/show`, false, {}, true);
    } else {
      notification(t("GROUP.EDIT.ERROR"));
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)} className="fadeInUp">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
        <Box gridColumn="1/4">
          <TextBoxField name="name" isRequired={true} label={t("GROUP.NAME")} form={hForm} />
          <RichTextareaField name="description" label={t("GROUP.DESCRIPTION")} form={hForm} />
        </Box>
        <ImageUploaderField label="Logo" name="icon" form={hForm} />
      </SimpleGrid>
      <IconCheckboxField
        name="speciesGroupId"
        label={t("GROUP.SPECIES_COVERAGE")}
        form={hForm}
        options={speciesGroups}
        type="species"
        isRequired={true}
      />
      <IconCheckboxField
        name="habitatId"
        label={t("GROUP.HABITATS_COVERED")}
        options={habitats}
        form={hForm}
        type="habitat"
        isRequired={true}
      />
      <CheckboxField
        name="allowUserToJoin"
        label={t("GROUP.JOIN_WITHOUT_INVITATION")}
        form={hForm}
      />
      <AreaDrawFieldProps
        label={t("GROUP.SPATIAL_COVERGE")}
        name={"spacialCoverage"}
        form={hForm}
        isRequired={true}
      />

      <SubmitButton form={hForm} mb={8}>
        {t("GROUP.UPDATE")}
      </SubmitButton>
    </form>
  );
}
