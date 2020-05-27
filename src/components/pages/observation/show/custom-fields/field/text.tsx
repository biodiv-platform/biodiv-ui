import { Text, Textarea } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { CustomFieldData } from "@interfaces/observation";
import React, { useState } from "react";

import Buttons from "./buttons";

interface IFieldTextProps {
  cf: CustomFieldData;
  isOpen: boolean;
  onClose;
  onUpdate;
}

export default function FieldText({ cf, onUpdate, onClose, isOpen }: IFieldTextProps) {
  const { t } = useTranslation();
  const [fieldTextData, setFieldTextData] = useState(cf.customFieldValues?.fieldTextData);

  const onSave = () => {
    onUpdate({ textBoxValue: fieldTextData });
  };

  return isOpen ? (
    <>
      <Textarea
        id={cf.cfId.toString()}
        value={fieldTextData}
        onChange={(e) => setFieldTextData(e.target.value)}
        aria-describedby={`${cf.cfId}-helper`}
      />
      <Buttons onSave={onSave} onClose={onClose} />
    </>
  ) : (
    <Text>{cf?.customFieldValues?.fieldTextData || t("OBSERVATION.UNKNOWN")}</Text>
  );
}
