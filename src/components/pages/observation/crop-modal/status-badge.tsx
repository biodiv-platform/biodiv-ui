import { Badge } from "@chakra-ui/react";
import { CROP_STATUS } from "@static/constants";
import useTranslation from "next-translate/useTranslation";
import React from "react";

function ObservationImageStatusBadge({ status }) {
  const { t } = useTranslation();

  switch (status) {
    case `${CROP_STATUS.SELECTED}`:
      return <Badge colorScheme="green">{t("observation:crop.selected")}</Badge>;

    case `${CROP_STATUS.REJECTED}`:
      return <Badge colorScheme="red">{t("observation:crop.rejected")}</Badge>;

    default:
      return <Badge colorScheme="blue">{t("observation:crop.not_curated")}</Badge>;
  }
}

export default ObservationImageStatusBadge;
