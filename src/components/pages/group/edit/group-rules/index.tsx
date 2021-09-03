import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import { formatGroupRules } from "@utils/userGroup";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import AddGroupRulesForm from "./group-rules-form";
import GroupRulesTable from "./group-rules-table";

export default function GroupRules({ userGroupId, rules }) {
  const { t } = useTranslation();
  const [groupRules, setGroupRules] = useState(formatGroupRules(rules));
  const [isCreate, setIsCreate] = useState(false);

  return (
    <Accordion allowToggle={true}>
      <AccordionItem
        mb={8}
        bg="white"
        border="1px solid var(--chakra-colors-gray-300)"
        borderRadius="md"
      >
        <AccordionButton _expanded={{ bg: "gray.100" }}>
          <Box flex={1} textAlign="left" fontSize="lg">
            🛂 {t("group:rules.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel p={4}>
          {isCreate ? (
            <AddGroupRulesForm
              groupRules={groupRules}
              setGroupRules={setGroupRules}
              setIsCreate={setIsCreate}
            />
          ) : (
            <GroupRulesTable
              userGroupId={userGroupId}
              groupRules={groupRules}
              setGroupRules={setGroupRules}
              setIsCreate={setIsCreate}
            />
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
