import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@configs/i18n/useTranslation";
import { CustomFieldPermission, ShowData } from "@interfaces/observation";
import React from "react";

import CustomFieldList from "./list";

export interface ICustomFieldsProps {
  observationId;
  cfPermission: CustomFieldPermission[];
  o: ShowData;
  setO;
}

export default function CustomFields(props: ICustomFieldsProps) {
  const { t } = useTranslation();
  const onCFUpdate = (data) => {
    props.setO((_draft: ShowData) => {
      _draft.customField = data;
    });
  };

  return props.o.customField.length ? (
    <Box mb={4} className="white-box">
      <BoxHeading>🔶 {t("OBSERVATION.CUSTOM_FIELDS")}</BoxHeading>
      <CustomFieldList {...props} setO={onCFUpdate} />
    </Box>
  ) : null;
}
