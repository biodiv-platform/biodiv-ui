import React from "react";
import { Box, useDisclosure, Button, Heading } from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import RadioInputField from "@components/form/radio";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "@configs/i18n/useTranslation";
import { PageHeading } from "@components/@core/layout";
import GroupSelector from "./customCheckbox";
import SelectAsync from "@components/form/select-async";
import { axQueryTagsByText } from "@services/observation.service";
import AdminInviteField from "./adminInviteField";
import MapInputForm from "./MapInputForm";
import GroupIconUploader from "../uploader";
import { userInvitaionOptions } from "../options";
import { axCreateGroup } from "@services/usergroup.service";
import { useLocalRouter } from "@components/@core/local-link";
import { adminInviteList } from "../options";

function createGroupForm({ speciesGroups, habitats }) {
  const hform = useForm();
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onClose, onOpen } = useDisclosure(true);

  const onTagsQuery = async (q) => {
    const { data } = await axQueryTagsByText(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  const getAdminUser = (adminList) => {
    const idsList = [],
      emailList = [];
    if (adminList && adminList.length > 0) {
      adminList.map((item) => {
        if (item.__isNew__) {
          emailList.push(item.value);
        } else {
          idsList.push(item.value);
        }
      });
    }
    return { idsList, emailList };
  };
  const handleFormSubmit = async () => {
    onClose();
    const group = hform.getValues();
    const founder = getAdminUser(group.founder);
    const moderator = getAdminUser(group.moderator);
    const payload = {
      allowUserToJoin: group.group_invitaion,
      description: group.group_description,
      icon: group.group_icon,
      name: group.group_name,
      neLatitude: group?.spacial_coverage?.ne?.[0] || "",
      neLongitude: group?.spacial_coverage?.ne?.[1] || "",
      swLatitude: group?.spacial_coverage?.se?.[0] || "",
      swLongitude: group?.spacial_coverage?.se?.[1] || "",
      languageId: 0,
      speciesGroup: group.sGroup || [],
      habitatId: group.habitatCoverage || [],
      sendDigestMail: true,
      // tags: group.tags,
      invitationData: {
        userGroupId: 0,
        founderIds: founder.idsList,
        moderatorsIds: moderator.idsList,
        founderEmail: founder.emailList,
        moderatorsEmail: moderator.emailList
      }
    };
    const { success, data } = await axCreateGroup(payload);
    if (success) {
      notification("Group Deatils Created Successfully", NotificationType.Success);
      onOpen();
      router.push(`/group/show/${data.id}`, true);
    } else {
      notification("Unable to create Group", NotificationType.Error);
      onOpen();
    }

    hform.reset({
      tags: [],
      spacial_coverage: [],
      sGroup: [],
      habitatCoverage: []
    });
    onOpen();
  };
  return (
    <Box mb={8} minH="calc(100vh - var(--heading-height))">
      <PageHeading>{t("GROUP.CREATE_GROUP_TITLE")}</PageHeading>
      <Box className="white-box" p="10px 30px" m="10px">
        <Heading as="h2" className="mt4" m="20px 0px" fontSize="x-large">
          <strong>Core Elements</strong>
        </Heading>
        <form onSubmit={hform.handleSubmit(handleFormSubmit)}>
          <TextBoxField name="group_name" isRequired={true} label={t("GROUP.NAME")} form={hform} />
          <TextAreaField name="group_description" label={t("GROUP.DESCRIPTION")} form={hform} />
          <GroupIconUploader form={hform} name="group_icon" />
          <GroupSelector
            name="sGroup"
            label={t("GROUP.SPECIES_COVERAGE")}
            options={speciesGroups}
            form={hform}
          />
          <GroupSelector
            name="habitatCoverage"
            label={t("GROUP.HABITATS_COVERED")}
            options={habitats}
            form={hform}
          />
          <RadioInputField
            form={hform}
            isInline={false}
            name="group_invitaion"
            label={t("GROUP.USER_INVITAION")}
            options={userInvitaionOptions}
          />
          <MapInputForm name={"spacial_coverage"} form={hform} />
          <SelectAsync
            name="tags"
            label={t("OBSERVATION.TAGS")}
            hint={t("OBSERVATION.TAGS_HINT")}
            form={hform}
            multiple={true}
            onQuery={onTagsQuery}
            mb={2}
          />
          <div className="white-box">
            <AdminInviteField
              adminList={adminInviteList}
              form={hform}
              adminTitle={t("GROUP.ADMIN_TITLE")}
            />
            <Button
              isLoading={!isOpen}
              m={15}
              type="submit"
              onSubmit={handleFormSubmit}
              variantColor="green"
            >
              Button
            </Button>
          </div>
        </form>
      </Box>
    </Box>
  );
}

export default createGroupForm;
