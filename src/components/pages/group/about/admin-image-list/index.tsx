import {
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import AdminListTooltip from "../../common/admin-list-tooltip";

export default function AdminImageList({ moderators, founders }) {
  const { t } = useTranslation();

  return (
    <AccordionItem
      isOpen={true}
      mb={8}
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
    >
      <AccordionHeader _expanded={{ bg: "gray.100" }}>
        <Heading as="h2" flex="1" textAlign="left" my={1} size="lg">
          🛡 {t("GROUP.ADMIN.TITLE")}
        </Heading>
        <AccordionIcon float="right" />
      </AccordionHeader>
      <AccordionPanel p={4}>
        <AdminListTooltip title={t("GROUP.ADMIN.FOUNDER")} adminList={founders} />
        <AdminListTooltip title={t("GROUP.ADMIN.MODERATOR")} adminList={moderators} />
      </AccordionPanel>
    </AccordionItem>
  );
}
