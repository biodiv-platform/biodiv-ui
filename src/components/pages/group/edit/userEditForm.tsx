import { Box, Button, Collapse, Icon, useDisclosure } from "@chakra-ui/core";
import PageHeading from "@components/@core/layout/page-heading";
import { useLocalRouter } from "@components/@core/local-link";
import RadioInputField from "@components/form/radio";
import Submit from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import { UserGroupEditData } from "@interfaces/userGroup";
import { axAddAdminMembers, axUpdateUserGroup } from "@services/usergroup.service";
import { getAdminUser } from "@utils/admin";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { adminInviteList, userInvitaionOptions } from "../form/options";
import AdminInviteField from "../form/speciesCheckBox/adminInviteField";
import GroupSelector from "../form/speciesCheckBox/customCheckbox";
import MapInputForm from "../form/speciesCheckBox/MapInputForm";
import GroupIconUploader from "../form/uploader";

interface IuserGroupEditProps {
  userGroup: UserGroupEditData;
  adminMembers;
  userGroupId;
  habitats;
  speciesGroups;
}

export default function ObservationEditForm({
  userGroup,
  userGroupId,
  adminMembers,
  speciesGroups,
  habitats
}: IuserGroupEditProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onClose } = useDisclosure(true);
  const [show, setShow] = useState(false);
  const { neLatitude, neLongitude, swLatitude, swLongitude } = userGroup;
  const userGroupCoverage = `${neLongitude},${neLatitude},${neLongitude},${swLatitude},${swLongitude},${swLatitude},${swLongitude},${neLatitude},${neLongitude},${neLatitude}`;
  const founder = adminMembers.founderList.map((item) => {
    return { label: item?.name, value: item?.id };
  });
  const moderator = adminMembers.moderatorList.map((item) => {
    return { label: item?.name, value: item?.id };
  });

  const coreForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      speciesGroup: Yup.array().required(),
      habitatId: Yup.array().required(),
      spacial_coverage: Yup.object().shape({
        ne: Yup.array().required(),
        se: Yup.array().required()
      })
    }),
    defaultValues: {
      name: userGroup.name,
      description: userGroup.description,
      icon: userGroup.icon,
      speciesGroup: userGroup.speciesGroupId,
      habitatId: userGroup.habitatId,
      allowUserToJoin: userGroup.allowUserToJoin ? "true" : "false",
      spacial_coverage: neLatitude ? userGroupCoverage : null
    }
  });

  const adminForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      founder_description: Yup.string(),
      moderator_description: Yup.string()
    }),
    defaultValues: {
      founder,
      moderator
    }
  });

  const handleOnSubmit = async (e, group) => {
    e.preventDefault();
    const { spacial_coverage, allowUserToJoin, speciesGroup, ...otherValues } = group;
    const payload = {
      ...otherValues,
      languageId: 205,
      sendDigestMail: true,
      homePage: null,
      domainName: null,
      theme: "default",
      newFilterRule: null,
      speciesGroupId: speciesGroup,
      allowUserToJoin: group.allowUserToJoin == "true" ? true : false,
      neLatitude: group?.spacial_coverage?.ne?.[1],
      neLongitude: group?.spacial_coverage?.ne?.[0],
      swLatitude: group?.spacial_coverage?.se?.[1],
      swLongitude: group?.spacial_coverage?.se?.[0]
    };

    const { success, data } = await axUpdateUserGroup(payload, userGroupId);

    if (success) {
      notification(t("GROUP.EDIT_SUCCESSFULL"), NotificationType.Success);
      onClose();
      router.push(`/group/${data.name}/show`, false, {}, true);
    } else {
      notification(t("GROUP.EDIT_ERROR"), NotificationType.Error);
      onClose();
    }
  };

  const FilterCurrentAdmin = (adminData, currentData) => {
    return adminData.filter(function (obj) {
      return !currentData.some(function (obj2) {
        return obj.value == obj2.value;
      });
    });
  };

  const submitAdminForm = async (adminData) => {
    const founderData = getAdminUser(FilterCurrentAdmin(adminData.founder, founder));
    const moderatorData = getAdminUser(FilterCurrentAdmin(adminData.moderator, moderator));
    const payload = {
      userGroupId,
      founderIds: founderData.idsList,
      moderatorsIds: moderatorData.idsList,
      founderEmail: founderData.emailList,
      moderatorsEmail: moderatorData.emailList
    };
    try {
      await axAddAdminMembers(payload);
      notification(t("GROUP.CREATE_SUCCESSFULL"), NotificationType.Success);
      router.push(`/group/${userGroup.name}/show`, false, {}, true);
    } catch (err) {
      notification(t("GROUP.CREATE_ERROR"), NotificationType.Error);
    }
  };

  return (
    <div>
      <Box className="white-box" p={[5]}>
        <PageHeading className="mt4">{t("GROUP.UPDATE_TITLE")}</PageHeading>
        <form
          onSubmit={(e) => {
            handleOnSubmit(e, coreForm.getValues());
          }}
        >
          <TextBoxField name="name" isRequired={true} label={t("GROUP.NAME")} form={coreForm} />
          <TextAreaField name="description" label={t("GROUP.DESCRIPTION")} form={coreForm} />
          <GroupIconUploader form={coreForm} name="icon" />
          <GroupSelector
            name="speciesGroup"
            label={t("GROUP.SPECIES_COVERAGE")}
            options={speciesGroups}
            form={coreForm}
          />
          <GroupSelector
            name="habitatId"
            label={t("GROUP.HABITATS_COVERED")}
            options={habitats}
            form={coreForm}
          />
          <RadioInputField
            form={coreForm}
            isInline={false}
            name="allowUserToJoin"
            label={t("GROUP.USER_INVITAION")}
            options={userInvitaionOptions}
          />
          <MapInputForm label={t("GROUP.MAPINPUT")} name={"spacial_coverage"} form={coreForm} />

          <Submit leftIcon="ibpcheck" isDisabled={!isOpen} form={coreForm} mb={4}>
            {t("GROUP.UPDATE_USERGROUP")}
          </Submit>
        </form>
      </Box>

      <Box className="white-box">
        <Button
          display="flex"
          variant="ghost"
          onClick={() => {
            setShow(!show);
          }}
          justifyContent="space-between"
          width="100%"
          size="lg"
        >
          {t("GROUP.ADMIN_TITLE")}
          <Icon name={show ? "minus" : "add"} />
        </Button>
        <Collapse isOpen={show}>
          <form onSubmit={adminForm.handleSubmit(submitAdminForm)}>
            <AdminInviteField
              adminList={adminInviteList}
              form={adminForm}
              adminMember={{ founder, moderator }}
              userGroupId={userGroupId}
              isMultiple={true}
            />
            <Box m={[5]}>
              <Submit leftIcon="ibpcheck" isDisabled={!isOpen} form={adminForm}>
                {t("GROUP.UPDATE_ADMIN")}
              </Submit>
            </Box>
          </form>
        </Collapse>
      </Box>
    </div>
  );
}
