import { Text } from "@chakra-ui/core";
import { ClearIndicator, selectStyles } from "@components/form/configs";
import CustomFieldOption from "@components/pages/observation/create/form/custom-field-form/custom-field-options";
import useTranslation from "@configs/i18n/useTranslation";
import { axGetAllCustomFieldOptionsById } from "@services/usergroup.service";
import React, { useEffect, useState } from "react";
import Select from "react-select";

import Buttons from "../buttons";

const parseCategoricalValue = (value, isMulti) => {
  return isMulti
    ? value?.multipleCategoricalData?.reduce((acc, item) => acc + ` ${item.values},`, "")
    : value?.singleCategoricalData?.values;
};

export default function CategoricalField({
  cf,
  onUpdate,
  userGroupId,
  observationId,
  onClose,
  isOpen
}) {
  const [isMulti] = useState(cf?.customFieldValues?.fieldType === "MULTIPLE CATEGORICAL");
  const { t } = useTranslation();
  const [fieldValue, setFieldValue] = useState<number[] | number>();
  const [options, setOptions] = useState([]);

  const onSave = () => {
    onUpdate(isMulti ? { multipleCategorical: [fieldValue] } : { singleCategorical: fieldValue });
  };

  useEffect(() => {
    axGetAllCustomFieldOptionsById(observationId, userGroupId, cf.cfId)
      .then((res) => {
        setOptions(res?.data?.map((item) => ({ label: item.values, value: item.id })));
      })
      .catch((err) => err);
  }, []);

  return isOpen ? (
    <>
      <Select
        id={name}
        inputId={name}
        onChange={(o) => {
          setFieldValue(isMulti ? o.map((item) => item.value) : o.value);
        }}
        options={options}
        components={{
          Option: CustomFieldOption,
          ClearIndicator
        }}
        isSearchable={true}
        isMulti={isMulti}
        styles={selectStyles}
      />
      <Buttons onSave={onSave} onClose={onClose} />
    </>
  ) : (
    <Text>{parseCategoricalValue(cf?.customFieldValues, isMulti) || t("OBSERVATION.UNKNOWN")}</Text>
  );
}
