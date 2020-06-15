import { useDisclosure, Box, Collapse, Button, Icon } from "@chakra-ui/core";
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
import React, { useState } from "react";
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
  const [show, setShow] = useState(false);
  const founder = [],
    moderator = [];
  const { neLatitude, neLongitude, swLatitude, swLongitude } = userGroup;
  const userGroupCoverage = `${neLongitude},${neLatitude},${neLongitude},${swLatitude},${swLongitude},${swLatitude},${swLongitude},${neLatitude},${neLongitude},${neLatitude}`;

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

  const onTagsQuery = async (q) => {
    const { data } = await axQueryTagsByText(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  setAdminToForm(userGroup, "founder");
  setAdminToForm(userGroup, "moderator");

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
      speciesGroup: userGroup.speciesGroup,
      habitatId: userGroup.habitatId,
      allowUserToJoin: userGroup.allowUserToJoin ? "true" : "false",
      spacial_coverage: neLatitude ? userGroupCoverage : null
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

  const handleOnSubmit = async (e, group) => {
    e.preventDefault();
    const payload = {
      allowUserToJoin: group.allowUserToJoin,
      description: group.description,
      icon: group.icon,
      homePage: null,
      domainName: null,
      theme: "default",
      newFilterRule: null,
      name: group.name,
      neLatitude: group?.spacial_coverage?.ne?.[1] || "",
      neLongitude: group?.spacial_coverage?.ne?.[0] || "",
      swLatitude: group?.spacial_coverage?.se?.[1] || "",
      swLongitude: group?.spacial_coverage?.se?.[0] || "",
      languageId: 205,
      speciesGroupId: group.speciesGroup || [],
      habitatId: group.habitatId || [],
      sendDigestMail: true
    };

    const { success } = await axUpdateUserGroup(payload, userGroupId);
    if (success) {
      notification(t("GROUP.EDIT_SUCCESSFULL"), NotificationType.Success);
      onClose();
      router.push(`/group/show/${userGroupId}`, true);
    } else {
      notification(t("GROUP.EDIT_ERROR"), NotificationType.Error);
      onClose();
    }
  };

  return (
    <div>
      <Box className="white-box" p={[10, 50]} m={[20, 0]}>
        <PageHeading className="mt4" style={{ margin: "20px 0px" }}>
          {t("GROUP.UPDATE_TITLE")}
        </PageHeading>
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
            {t("GROUP.UPDATE_USERGROUP")}
          </Submit>
        </form>
      </Box>

      <Box className="white-box" p={[10, 50]} m={[20, 0]}>
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
          {<Icon name={show ? "minus" : "add"} />}
        </Button>
        <Collapse isOpen={show}>
          <form>
            <AdminInviteField
              adminList={adminInviteList}
              form={adminForm}
              adminTitle={t("GROUP.ADMIN_TITLE")}
            />
            <Submit leftIcon="ibpcheck" isDisabled={!isOpen} form={adminForm} mb={4}>
              {t("GROUP.UPDATE_ADMIN")}
            </Submit>
          </form>
        </Collapse>
      </Box>
    </div>
  );
}
