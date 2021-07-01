import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import { CustomFieldPermission, ShowData } from "@interfaces/observation";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import CustomFieldList from "./list";

export interface ICustomFieldsProps {
  observationId;
  cfPermission: CustomFieldPermission[] | undefined;
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

  return props.o.customField?.length ? (
    <Box mb={4} className="white-box">
      <BoxHeading>🔶 {t("observation:custom_fields")}</BoxHeading>
      <CustomFieldList {...props} setO={onCFUpdate} />
    </Box>
  ) : null;
}
