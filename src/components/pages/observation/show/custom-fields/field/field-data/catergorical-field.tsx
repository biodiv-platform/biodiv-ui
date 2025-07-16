import { Box, Text } from "@chakra-ui/react";
import { ClearIndicator, selectStyles } from "@components/form/configs";
import CustomFieldOption from "@components/pages/observation/create/form/custom-field-form/custom-field-options";
import { axGetAllCustomFieldOptionsById } from "@services/usergroup.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import Select from "react-select";

import Buttons from "../buttons";

const parseCategoricalValue = (value, isMulti) => {
  return isMulti
    ? value?.multipleCategoricalData?.reduce((acc, item) => acc + ` ${item.values},`, "")
    : value?.singleCategoricalData?.values;
};

export default function CatergoricalField({
  cf,
  onUpdate,
  userGroupId,
  observationId,
  onClose,
  isOpen
}) {
  const [isMulti] = useState(cf?.fieldType === "MULTIPLE CATEGORICAL");
  const { t } = useTranslation();
  const [fieldValue, setFieldValue] = useState<number[] | number>();
  const [options, setOptions] = useState<any[]>([]);

  const onSave = () => {
    onUpdate(
      isMulti
        ? { multipleCategorical: Array.isArray(fieldValue) ? [...fieldValue] : [] }
        : { singleCategorical: fieldValue }
    );
  };

  useEffect(() => {
    axGetAllCustomFieldOptionsById(observationId, userGroupId, cf.cfId)
      .then((res) => {
        setOptions(res?.data?.map((item) => ({ label: item.values, value: item.id })));
      })
      .catch((err) => err);
  }, []);

  return isOpen ? (
    <Box width={"full"}>
      <Select
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
    </Box>
  ) : (
    <Text>{parseCategoricalValue(cf?.customFieldValues, isMulti) || t("common:unknown")}</Text>
  );
}
