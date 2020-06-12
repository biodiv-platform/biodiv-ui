import React from "react";
import { Box, Heading } from "@chakra-ui/core";
import SelectAsync from "@components/form/select-async";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import { axUserSearch } from "@services/auth.service";
import { axRemoveAdminMembers } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import { FormContextValues } from "react-hook-form";

interface AdminListDeatils {
  adminTitle?: string;
  adminList: any[];
  userGroupId?: string;
  form: FormContextValues<any>;
  isMultiple?: boolean;
  adminMember?: any;
}

interface AdminDeatils {
  name: string;
  label?: string;
  textBoxName: string;
  textBoxLabel?: string;
  fieldGroupTitle: string;
}

const AdminInviteField = (props: AdminListDeatils) => {
  const { t } = useTranslation();
  const { form, userGroupId, adminMember } = props;
  const onAdminUserQuery = async (q) => {
    const { data } = await axUserSearch(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  const handleDelete = async (userId, name) => {
    if (
      adminMember &&
      adminMember[name] &&
      adminMember[name].some((item) => item.value == userId?.value)
    ) {
      const { success } = await axRemoveAdminMembers({ userId: userId.value, userGroupId });
      if (success) {
        notification(t("GROUP.DELETED_MEMBER"), NotificationType.Success);
      } else {
        notification(t("GROUP.DELETE_MEMBER_ERROR"), NotificationType.Error);
      }
    }
  };

  return (
    <div>
      {props.adminTitle && (
        <Heading as="h2" className="mt4" m="20px" fontSize="x-large">
          Administrator
        </Heading>
      )}
      {props.adminList &&
        props.adminList.length &&
        props.adminList.map((item: AdminDeatils, index) => (
          <Box m={15} key={index}>
            <div>
              <h3>{item.fieldGroupTitle}</h3>
            </div>
            <div>
              <SelectAsync
                name={item.name}
                form={form}
                placeholder={t("GROUP.INVITE")}
                deleteTitle={t("GROUP.DELETE_MEMBER_TITLE")}
                deleteMessage={t("GROUP.DELETE_MEMBER_MESSAGE")}
                onQuery={onAdminUserQuery}
                multiple={props.isMultiple}
                onDelete={handleDelete}
                label={item.label}
              />
              <TextAreaField
                placeholder={t("GROUP.ADMIN_TEXTBOX")}
                label={item.textBoxLabel}
                name={item.textBoxName}
                form={form}
              />
            </div>
          </Box>
        ))}
    </div>
  );
};

export default AdminInviteField;
