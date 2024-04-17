import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import ObservationCustomizationForm from "./form";

export default function ObservationCustomizations({ userGroupId, mediaToggle }) {
  const { t } = useTranslation();
  return (
    <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
      <BoxHeading>🖥️ {t("group:observation_display")}</BoxHeading>
      <Box p={3}>
        <ObservationCustomizationForm userGroupId={userGroupId} mediaToggle={mediaToggle} />
      </Box>
    </Box>
  );
}
