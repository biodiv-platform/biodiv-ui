import { Box, SimpleGrid } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import { CheckboxField } from "@components/form/checkbox";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import { axUserGroupCreate } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
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

export const transformMemberPayload = (membersList) => {
  return (membersList || [])?.reduce(
    ({ idsList, emailList }, item: any) => {
      return item["__isNew__"]
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
  const { languageId } = useGlobalState();

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
      languageId: languageId,
      ...STATIC_GROUP_PAYLOAD,
      ...otherValues,
      ...spacialCoverageBounds,
      invitationData
    };

    const { success, data } = await axUserGroupCreate(payload);
    if (success) {
      notification(t("group:create.success"), NotificationType.Success);
      router.push(`/group/${data.name}/show`, false, {}, true);
    } else {
      notification(t("group:create.error"));
    }
  };

  return (
    <div className="container mt">
      <PageHeading>👥 {t("group:create.title")}</PageHeading>

      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={{ md: 4 }}>
            <Box gridColumn="1/4">
              <TextBoxField name="name" isRequired={true} label={t("group:name")} />
              <RichTextareaField name="description" label={t("form:description.title")} />
            </Box>
            <ImageUploaderField label="Logo" name="icon" />
          </SimpleGrid>
          <IconCheckboxField
            name="speciesGroup"
            label={t("common:species_coverage")}
            options={speciesGroups}
            type="species"
            isRequired={true}
          />
          <IconCheckboxField
            name="habitatId"
            label={t("common:habitats_covered")}
            options={habitats}
            type="habitat"
            isRequired={true}
          />
          <CheckboxField name="allowUserToJoin" label={t("group:join_without_invitation")} />
          <AreaDrawField
            label={t("group:spatial_coverge")}
            name={"spacialCoverage"}
            mb={8}
            isRequired={true}
          />

          <PageHeading as="h2" size="lg">
            🛡️ {t("group:admin.title")}
          </PageHeading>

          <AdminInviteField name="founder" label={t("group:invite_founders")} />
          <AdminInviteField name="moderator" label={t("group:invite_moderators")} />

          <SubmitButton mt={2} mb={6}>
            {t("group:save")}
          </SubmitButton>
        </form>
      </FormProvider>
    </div>
  );
}
