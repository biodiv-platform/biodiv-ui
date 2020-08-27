import { Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React, { useState } from "react";

const parseCategoricalValue = (value, isMulti) => {
  return isMulti
    ? value?.multipleCategoricalData?.reduce((acc, item) => acc + ` ${item.values},`, "")
    : value?.singleCategoricalData?.values;
};

export default function CategoricalField({ cf }) {
  const [isMulti] = useState(!!cf?.customFieldValues?.multipleCategoricalData);
  const { t } = useTranslation();
  const [fieldValue] = useState<string[] | string>(
    parseCategoricalValue(cf?.customFieldValues, isMulti)
  );

  return <Text>{fieldValue || t("OBSERVATION.UNKNOWN")}</Text>;
}
