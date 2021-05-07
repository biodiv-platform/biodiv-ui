import SelectAsyncInputField from "@components/form/select-async";
import { axUserSearch } from "@services/auth.service";
import React from "react";
import { UseFormMethods } from "react-hook-form";

interface IUserSelectProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  form: UseFormMethods<Record<string, any>>;
  style?;
  isRequired?;
}

const UserSelectField = ({ name, label, form, mb, isRequired }: IUserSelectProps) => {
  const onUserQuery = async (q) => {
    const { data } = await axUserSearch(q);

    return data.map((tag) => ({
      label: tag.name,
      value: tag.id,
      version: tag.version
    }));
  };

  return (
    <SelectAsyncInputField
      name={name}
      form={form}
      placeholder={label}
      onQuery={onUserQuery}
      multiple={true}
      isClearable={false}
      resetOnSubmit={false}
      label={label}
      isRequired={isRequired}
      mb={mb}
    />
  );
};

export default UserSelectField;
