import React from "react";
import { Box } from "@chakra-ui/core";
import SelectAsync from "@components/form/select-async";
import TextAreaField from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import { axUserSearch } from "@services/auth.service";
import { FormContextValues } from "react-hook-form";

interface AdminListDeatils {
  adminTitle: string;
  adminList: any[];
  form: FormContextValues<any>;
}

interface AdminDeatils {
  name: string;
  label?: string;
  textBoxName: string;
  textBoxLabel?: string;
  fieldGroupTitle: string;
  isMultiple?: boolean;
}

const AdminInviteField = (props: AdminListDeatils) => {
  const { t } = useTranslation();
  const onAdminUserQuery = async (q) => {
    const { data } = await axUserSearch(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };
  return (
    <div>
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
                form={props.form}
                placeholder={t("GROUP.INVITE")}
                onQuery={onAdminUserQuery}
                multiple={item.isMultiple}
                label={item.label}
              />
              <TextAreaField
                placeholder={t("GROUP.ADMIN_TEXTBOX")}
                label={item.textBoxLabel}
                name={item.textBoxName}
                form={props.form}
              />
            </div>
          </Box>
        ))}
    </div>
  );
};

export default AdminInviteField;
