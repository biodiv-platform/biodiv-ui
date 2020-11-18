import { Box, SimpleGrid } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import CheckBoxField from "@components/form/checkbox";
import RichTextareaField from "@components/form/rich-textarea";
import SubmitButton from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import { axUserGroupCreate } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import AdminInviteField from "../common/admin-invite-field";
import AreaDrawField from "../common/area-draw-field";
import IconCheckboxField from "../common/icon-checkbox-field";
import ImageUploaderField from "../common/image-uploader-field";
import { STATIC_GROUP_PAYLOAD } from "../common/static";

interface GroupCreatePageComponentProps {
  speciesGroups;
  habitats;
}

export const transformMemberPayload = (membersList = []) => {
  return membersList.reduce(
    ({ idsList, emailList }, item) => {
      return item.__isNew__
        ? { idsList, emailList: [...emailList, item.value] }
        : { emailList, idsList: [...idsList, item.value] };
    },
    { idsList: [], emailList: [] }
  );
};

export default function CreateGroupPageComponent({
  speciesGroups,
  habitats
}: GroupCreatePageComponentProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(),
        speciesGroup: Yup.array().required(),
        habitatId: Yup.array().required(),
        allowUserToJoin: Yup.boolean().required(),
        spacialCoverage: Yup.object().shape({
          ne: Yup.array().required(),
          se: Yup.array().required()
        }),
        icon: Yup.string().nullable(),
        founder: Yup.array().nullable(),
        moderator: Yup.array().nullable()
      })
    ),
    defaultValues: {
      allowUserToJoin: true
    }
  });

  const handleFormSubmit = async (values) => {
    const { spacialCoverage, founder, moderator, ...otherValues } = values;

    const spacialCoverageBounds = {
      neLatitude: spacialCoverage?.ne?.[1],
      neLongitude: spacialCoverage?.ne?.[0],
      swLatitude: spacialCoverage?.se?.[1],
      swLongitude: spacialCoverage?.se?.[0]
    };

    const founderFormat = transformMemberPayload(founder);
    const moderatorFormat = transformMemberPayload(moderator);
    const invitationData = {
      userGroupId: 0,
      founderIds: founderFormat.idsList,
      moderatorsIds: moderatorFormat.idsList,
      founderEmail: founderFormat.emailList,
      moderatorsEmail: moderatorFormat.emailList
    };

    const payload = {
      ...STATIC_GROUP_PAYLOAD,
      ...otherValues,
      ...spacialCoverageBounds,
      invitationData
    };

    const { success, data } = await axUserGroupCreate(payload);
    if (success) {
      notification(t("GROUP.CREATE.SUCCESS"), NotificationType.Success);
      router.push(`/group/${data.name}/show`, false, {}, true);
    } else {
      notification(t("GROUP.CREATE.ERROR"));
    }
  };

  return (
    <div className="container mt">
      <PageHeading>👥 {t("GROUP.CREATE.TITLE")}</PageHeading>

      <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ md: 4 }}>
          <Box gridColumn="1/4">
            <TextBoxField name="name" isRequired={true} label={t("GROUP.NAME")} form={hForm} />
            <RichTextareaField name="description" label={t("GROUP.DESCRIPTION")} form={hForm} />
          </Box>
          <ImageUploaderField label="Logo" name="icon" form={hForm} />
        </SimpleGrid>
        <IconCheckboxField
          name="speciesGroup"
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
        <CheckBoxField
          name="allowUserToJoin"
          label={t("GROUP.JOIN_WITHOUT_INVITATION")}
          form={hForm}
        />
        <AreaDrawField
          label={t("GROUP.SPATIAL_COVERGE")}
          name={"spacialCoverage"}
          form={hForm}
          mb={8}
          isRequired={true}
        />

        <PageHeading as="h2" size="lg">
          🛡️ {t("GROUP.ADMIN.TITLE")}
        </PageHeading>

        <AdminInviteField form={hForm} name="founder" label={t("GROUP.INVITE_FOUNDERS")} />
        <AdminInviteField form={hForm} name="moderator" label={t("GROUP.INVITE_MODERATORS")} />

        <SubmitButton form={hForm} mt={2} mb={6}>
          {t("GROUP.SAVE")}
        </SubmitButton>
      </form>
    </div>
  );
}
