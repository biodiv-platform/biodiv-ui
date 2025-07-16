import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import GroupRole from "./group-role";
import TaxonRole from "./taxon-role";

export default function RolesFilter() {
  const { t } = useTranslation();

  return (
    <AccordionItem value={"roles"}>
      <AccordionItemTrigger pr={4}>
        <Box flex={1} textAlign="left" pl={4}>
          {t("filters:user.role_title")}
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent>
        <GroupRole />
        <TaxonRole />
      </AccordionItemContent>
    </AccordionItem>
  );
}
