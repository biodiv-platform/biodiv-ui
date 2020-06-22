import { Box, Button, Heading, useDisclosure } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import RadioInputField from "@components/form/radio";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import { axCreateGroup } from "@services/usergroup.service";
import { getAdminUser } from "@utils/admin";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { adminInviteList, userInvitaionOptions } from "../options";
import GroupIconUploader from "../uploader";
import AdminInviteField from "./adminInviteField";
import GroupSelector from "./customCheckbox";
import MapInputForm from "./MapInputForm";

function createGroupForm({ speciesGroups, habitats }) {
  const hform = useForm({
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      speciesGroup: Yup.array().required(),
      habitatId: Yup.array().required(),
      spacial_coverage: Yup.object().shape({
        ne: Yup.array().required(),
        se: Yup.array().required()
      })
    })
  });
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onClose, onOpen } = useDisclosure(true);
  const handleFormSubmit = async (group) => {
    onClose();
    const { spacial_coverage, founder, moderator, allowUserToJoin, ...otherValues } = group;
    const founderFormat = getAdminUser(founder);
    const moderatorFormat = getAdminUser(moderator);
    const payload = {
      ...otherValues,
      languageId: 205,
      sendDigestMail: true,
      homePage: null,
      domainName: null,
      theme: "default",
      newFilterRule: null,
      allowUserToJoin: group.allowUserToJoin == "true" ? true : false,
      neLatitude: group?.spacial_coverage?.ne?.[1],
      neLongitude: group?.spacial_coverage?.ne?.[0],
      swLatitude: group?.spacial_coverage?.se?.[1],
      swLongitude: group?.spacial_coverage?.se?.[0],
      invitationData: {
        userGroupId: 0,
        founderIds: founderFormat.idsList,
        moderatorsIds: moderatorFormat.idsList,
        founderEmail: founderFormat.emailList,
        moderatorsEmail: moderatorFormat.emailList
      }
    };

    const { success, data } = await axCreateGroup(payload);
    if (success) {
      notification(t("GROUP.CREATE_SUCCESSFULL"), NotificationType.Success);
      router.push(`/group/${data.name}/show`, false, {}, true);
    } else {
      notification(t("GROUP.CREATE_ERROR"), NotificationType.Error);
    }

    hform.reset({
      tags: [],
      spacial_coverage: [],
      speciesGroup: [],
      habitatId: []
    });
    onOpen();
  };

  return (
    <Box mb={8}>
      <PageHeading>{t("GROUP.CREATE_GROUP_TITLE")}</PageHeading>
      <Box className="white-box" p={[10, 30]}>
        <Heading as="h2" pt={[5]} pb={[5]} fontSize="x-large">
          {t("GROUP.CORE_ELEMENT")}
        </Heading>
        <form onSubmit={hform.handleSubmit(handleFormSubmit)}>
          <TextBoxField name="name" isRequired={true} label={t("GROUP.NAME")} form={hform} />
          <TextAreaField name="description" label={t("GROUP.DESCRIPTION")} form={hform} />
          <GroupIconUploader form={hform} name="icon" />
          <GroupSelector
            name="speciesGroup"
            label={t("GROUP.SPECIES_COVERAGE")}
            options={speciesGroups}
            form={hform}
          />
          <GroupSelector
            name="habitatId"
            label={t("GROUP.HABITATS_COVERED")}
            options={habitats}
            form={hform}
          />
          <RadioInputField
            form={hform}
            isInline={false}
            name="allowUserToJoin"
            label={t("GROUP.USER_INVITAION")}
            options={userInvitaionOptions}
          />
          <MapInputForm label={t("GROUP.MAPINPUT")} name={"spacial_coverage"} form={hform} />
          <div className="white-box">
            <AdminInviteField
              adminList={adminInviteList}
              form={hform}
              isMultiple={true}
              adminTitle={t("GROUP.ADMIN_TITLE")}
            />
            <Button isLoading={!isOpen} m={15} type="submit" variantColor="green">
              Save
            </Button>
          </div>
        </form>
      </Box>
    </Box>
  );
}

export default createGroupForm;
