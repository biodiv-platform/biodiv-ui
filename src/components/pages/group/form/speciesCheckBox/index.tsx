import React from "react";
import { Box, useDisclosure, Button } from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import RadioInputField from "@components/form/radio";
// import * as Yup from "yup";
import { emit } from "react-gbus";
import useTranslation from "@configs/i18n/useTranslation";
import { PageHeading } from "@components/@core/layout";
import GroupSelector from "./customCheckbox";
import SelectAsync from "@components/form/select-async";
import { axQueryTagsByText } from "@services/observation.service";
import AdminInviteField from "./adminInviteField";
import MapInputForm from "./MapInputForm";
import SavingGroup from "../../saving";
import { SYNC_SINGLE_GROUP } from "@static/events";
import GroupIconUploader from "../uploader";
// import Submit from "@components/form/submit-button";
// import { parseDate } from "@utils/date";
// import { useStoreState } from "easy-peasy";

function createGroupForm({ speciesGroups, habitats }) {
  const hform = useForm();
  const { t } = useTranslation();
  const { isOpen, onClose } = useDisclosure(true);
  const adminInviteList = [
    {
      name: "founder",
      textBoxName: "founder-description",
      fieldGroupTitle: "Invite Founders",
      isMultiple: true
    },
    {
      name: "moderator",
      textBoxName: "moderator-description",
      fieldGroupTitle: "Invite Moderator",
      isMultiple: true
    }
  ];

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
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const group = hform.getValues();
    const founder = getAdminUser(group.founder);
    const moderator = getAdminUser(group.moderator);
    const payload = {
      allowUserToJoin: group.group_invitaion,
      description: group.group_description,
      icon: group.group_icon,
      name: group.group_name,
      neLatitude: group && group.spacial_coverage.ne ? group.spacial_coverage.ne[0] : "",
      neLongitude: group && group.spacial_coverage.ne ? group.spacial_coverage.ne[1] : "",
      swLatitude: group && group.spacial_coverage.se ? group.spacial_coverage.se[0] : "",
      swLongitude: group && group.spacial_coverage.se ? group.spacial_coverage.se[1] : "",
      languageId: 0,
      spacialCOverage: group.sGroup ? group.sGroup : [],
      habitatCoverage: group.habitatCoverage ? group.habitatCoverage : [],
      sendDigestMail: true,
      tags: group.tags,
      invitationData: {
        userGroupId: 0,
        founderIds: founder.idsList,
        moderatorsIds: moderator.idsList,
        founderEmail: founder.emailList,
        moderatorsEmail: moderator.emailList
      }
    };
    // console.log("the redo you",hform.getValues())
    emit(SYNC_SINGLE_GROUP, { group: payload, instant: true });
    onClose();
  };
  return isOpen ? (
    <Box mb={8} minH="calc(100vh - var(--heading-height))">
      <PageHeading>{t("GROUP.CREATE_GROUP_TITLE")}</PageHeading>
      <Box className="white-box" style={{ padding: "10px 30px", margin: "10px" }}>
        <h2 className="mt4" style={{ margin: "20px 0px", fontSize: 25 }}>
          <strong>Core Elements</strong>
        </h2>
        <form onSubmit={handleFormSubmit}>
          <TextBoxField
            name="group_name"
            isRequired={true}
            label={t("GROUP.GROUP_NAME")}
            form={hform}
          />
          <TextAreaField
            name="group_description"
            label={t("GROUP.GROUP_DESCRIPTION")}
            form={hform}
          />
          <GroupIconUploader form={hform} name="group_icon" />
          <GroupSelector
            name="sGroup"
            label={t("GROUP.SPECIES_GROUP_COVERAGE")}
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
            label="Can user join the group without invitaion"
            options={[
              { label: "yes", value: "true" },
              { label: "no", value: "false" }
            ]}
          />
          <MapInputForm form={hform} />
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
              adminTitle={"GROUP.GROUP_ADMIN_TITLE"}
            />
            <Button
              className="white-box-padding"
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
  ) : (
    <SavingGroup />
  );
}

export default createGroupForm;
