import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import GroupRole from "./group-role";
import TaxonRole from "./taxon-role"

export default function RolesFilter() {
  const { t } = useTranslation();

  return (
    <AccordionItem>
      {() => (
        <>
          <AccordionButton>
            <Box flex={1} textAlign="left">
              {t("filters:user.role_title")}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel> <GroupRole /><TaxonRole /></AccordionPanel>

        </>
      )}
    </AccordionItem>
  );
}
