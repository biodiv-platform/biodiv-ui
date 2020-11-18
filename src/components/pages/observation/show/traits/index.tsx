import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@hooks/use-translation";
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
