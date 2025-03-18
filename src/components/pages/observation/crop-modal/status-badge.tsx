import { Badge } from "@chakra-ui/react";
import { CROP_STATUS } from "@static/constants";
import useTranslation from "next-translate/useTranslation";
import React from "react";

function ObservationImageStatusBadge({ status }) {
  const { t } = useTranslation();

  switch (status) {
    case `${CROP_STATUS.SELECTED}`:
      return <Badge colorPalette="green"> {t("observation:crop.status.selected")} </Badge>;

    case `${CROP_STATUS.REJECTED}`:
      return <Badge colorPalette="red"> {t("observation:crop.status.rejected")} </Badge>;

    default:
      return <Badge colorPalette="blue"> {t("observation:crop.status.not_curated")} </Badge>;
  }
}

export default ObservationImageStatusBadge;
