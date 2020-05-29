import React from "react";
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
      <h1 className="mt4" style={{ margin: "20px 15px", fontSize: 25 }}>
        <strong>{t(props.adminTitle)}</strong>
      </h1>
      {props.adminList &&
        props.adminList.length &&
        props.adminList.map((item: AdminDeatils, index) => (
          <div className="white-box-padding" key={index}>
            <div>
              <h3>{item.fieldGroupTitle}</h3>
            </div>
            <div>
              <SelectAsync
                placeholder={t(`GROUP.ADMIN_INVITE`)}
                name={item.name}
                form={props.form}
                onQuery={onAdminUserQuery}
                multiple={item.isMultiple ? item.isMultiple : false}
                label={item.label ? item.label : ""}
              />
              <TextAreaField
                placeholder={t(`GROUP.ADMIN_TEXTBOX_${item.name.toUpperCase()}`)}
                label={item.textBoxLabel ? item.textBoxLabel : ""}
                name={item.textBoxName}
                form={props.form}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminInviteField;
