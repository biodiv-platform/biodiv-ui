import { SelectAsyncInputField } from "@components/form/select-async";
import { axUserSearch } from "@services/auth.service";
import React from "react";

interface IUserSelectProps {
  name: string;
  label: string;
  mb?: number;
  disabled?: boolean;
  hint?: string;
  style?;
  isRequired?;
}

const UserSelectField = ({ name, label, mb, isRequired }: IUserSelectProps) => {
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
