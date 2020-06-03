import { useDisclosure, Box } from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import Submit from "@components/form/submit-button";
import useTranslation from "@configs/i18n/useTranslation";
import { UserGroupEditData } from "@interfaces/userGroup";
import { axUpdateUserGroup } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import AdminInviteField from "../form/speciesCheckBox/adminInviteField";
import SelectAsync from "@components/form/select-async";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import RadioInputField from "@components/form/radio";
import MapInputForm from "../form/speciesCheckBox/MapInputForm";
import GroupIconUploader from "../form/uploader";
import GroupSelector from "../form/speciesCheckBox/customCheckbox";
import { adminInviteList, userInvitaionOptions } from "../form/options";
import PageHeading from "@components/@core/layout/page-heading";
import { axQueryTagsByText } from "@services/observation.service";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { axUserSearchById } from "@services/auth.service";

interface IuserGroupEditProps {
  userGroup: UserGroupEditData;
  userGroupId;
  habitats;
  speciesGroups;
}

export default function ObservationEditForm({
  userGroup,
  userGroupId,
  speciesGroups,
  habitats
}: IuserGroupEditProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onClose } = useDisclosure(true);
  const founder = [],
    moderator = [];
  const setAdminToForm = (adminList, type) => {
    if (adminList?.length) {
      Promise.all(
        adminList.invitationData[`${type}Id`].map(async (item) => {
          const { data } = await axUserSearchById(item);
          return data;
        })
      ).then((data) => {
        type === "founder" ? founder.push(data) : moderator.push(data);
      });
      adminList.invitationData[`${type}Email`].map((item) => {
        type === "founder"
          ? founder.push({ value: item, label: item, __isNew__: true })
          : moderator.push({ label: item, value: item });
      });
    }
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
  const { neLatitude, neLongitude, swLatitude, swLongitude } = userGroup;
  const userGroupCoverage = `${neLatitude},${neLongitude},${swLatitude},${swLongitude},${neLatitude},${swLongitude},${swLongitude},${neLatitude}`;
  const onTagsQuery = async (q) => {
    const { data } = await axQueryTagsByText(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  setAdminToForm(userGroup, "founder");
  setAdminToForm(userGroup, "moderator");

  const coreForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      group_name: Yup.string(),
      group_description: Yup.string(),
      group_icon: Yup.string(),
      sGroup: Yup.array(),
      habitatCoverage: Yup.array(),
      spacial_coverage: Yup.array(),
      tags: Yup.array()
    }),
    defaultValues: {
      group_name: userGroup.name,
      group_description: userGroup.description,
      group_icon: userGroup.icon,
      sGroup: userGroup.speciesCoverage,
      habitatCoverage: userGroup.habitatCoverage,
      tags: userGroup.tags,
      group_invitaion: userGroup.allowUserToJoin,
      spacial_coverage: userGroupCoverage
    }
  });

  const adminForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      founder: Yup.array(),
      moderator: Yup.array(),
      founder_description: Yup.string(),
      moderator_description: Yup.string()
    }),
    defaultValues: {
      founder,
      moderator,
      founder_description: "",
      moderator_description: ""
    }
  });

  const handleOnSubmit = async (group) => {
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
      speciesCoverage: group.sGroup || [],
      habitatCoverage: group.habitatCoverage || [],
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
    const { success } = await axUpdateUserGroup(payload, userGroupId);
    if (success) {
      notification("Group Deatils Updated Successfully", NotificationType.Success);
      onClose();
      router.push(`/group/show/${userGroupId}`, true);
    }
  };

  return (
    <div>
      <Box className="white-box" p="10px 50px" m="20px 0px">
        <PageHeading className="mt4" style={{ margin: "20px 0px", fontSize: 25 }}>
          <strong>{t("GROUP.ADMIN_TITLE")}</strong>
        </PageHeading>
        <form onSubmit={coreForm.handleSubmit(handleOnSubmit)}>
          <TextBoxField
            name="group_name"
            isRequired={true}
            label={t("GROUP.NAME")}
            form={coreForm}
          />
          <TextAreaField name="group_description" label={t("GROUP.DESCRIPTION")} form={coreForm} />
          <GroupIconUploader form={coreForm} name="group_icon" />
          <GroupSelector
            name="sGroup"
            label={t("GROUP.SPECIES_COVERAGE")}
            options={speciesGroups}
            form={coreForm}
          />
          <GroupSelector
            name="habitatCoverage"
            label={t("GROUP.HABITATS_COVERED")}
            options={habitats}
            form={coreForm}
          />
          <RadioInputField
            form={coreForm}
            isInline={false}
            name="group_invitaion"
            label={t("GROUP.USER_INVITAION")}
            options={userInvitaionOptions}
          />
          <MapInputForm name={"spacial_coverage"} form={coreForm} />
          <SelectAsync
            name="tags"
            label={t("OBSERVATION.TAGS")}
            hint={t("OBSERVATION.TAGS_HINT")}
            form={coreForm}
            multiple={true}
            onQuery={onTagsQuery}
            mb={2}
          />

          <Submit leftIcon="ibpcheck" isDisabled={!isOpen} form={coreForm} mb={4}>
            {t("OBSERVATION.UPDATE_OBSERVATION")}
          </Submit>
        </form>
      </Box>
      <div className="white-box">
        <form onSubmit={adminForm.handleSubmit(handleOnSubmit)}>
          <AdminInviteField
            adminList={adminInviteList}
            form={adminForm}
            adminTitle={t("GROUP.ADMIN_TITLE")}
          />
          <Submit leftIcon="ibpcheck" isDisabled={!isOpen} form={adminForm} mb={4}>
            {t("OBSERVATION.UPDATE_OBSERVATION")}
          </Submit>
        </form>
      </div>
    </div>
  );
}
