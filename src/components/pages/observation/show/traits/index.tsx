import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import Traits, { ITraitsProps } from "./traits-list";

export default function TraitsPanel(props: ITraitsProps) {
  const { t } = useTranslation();

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>💎 {t("OBSERVATION.TRAITS")}</BoxHeading>
      <Traits {...props} />
    </Box>
  );
}
