import { SelectAsyncInputField } from "@components/form/select-async";
import { axSpeciesContributorUserSearch } from "@services/auth.service";
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

const ContributorSelectField = ({ name, label, mb, isRequired }: IUserSelectProps) => {
  const onUserQuery = async (q) => {
    const { data } = await axSpeciesContributorUserSearch(q);

    return data.map((tag) => ({
      label: `${tag.name} (${tag.id})`,
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

export default ContributorSelectField;
