import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/core";
import useTranslation from "@hooks/use-translation";
import { formatGroupRules } from "@utils/userGroup";
import React, { useState } from "react";

import AddGroupRulesForm from "./group-rules-form";
import GroupRulesTable from "./group-rules-table";

export default function GroupRules({ userGroupId, rules }) {
  const { t } = useTranslation();
  const [groupRules, setGroupRules] = useState(formatGroupRules(rules));
  const [isCreate, setIsCreate] = useState(false);

  return (
    <Accordion allowToggle={true}>
      <AccordionItem mb={8} bg="white" border="1px solid var(--gray-300)" borderRadius="md">
        <AccordionButton _expanded={{ bg: "gray.100" }}>
          <Box flex={1} textAlign="left" fontSize="lg">
            🛂 {t("GROUP.RULES.TITLE")}
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
