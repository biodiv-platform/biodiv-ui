import {
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { formatGroupRules } from "@utils/userGroup";
import React, { useState } from "react";

import AddGroupRulesForm from "./group-rules-form";
import GroupRulesTable from "./group-rules-table";

export default function GroupRules({ userGroupId, rules }) {
  const { t } = useTranslation();
  const [groupRules, setGroupRules] = useState(formatGroupRules(rules));
  const [isCreate, setIsCreate] = useState(false);

  return (
    <AccordionItem mb={8} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
      <AccordionHeader _expanded={{ bg: "gray.100" }}>
        <Heading as="h2" flex="1" textAlign="left" my={1} size="lg">
          🛂 {t("Rules")}
        </Heading>
        <AccordionIcon float="right" />
      </AccordionHeader>

      <AccordionPanel p={4}>
        {isCreate ? (
          <AddGroupRulesForm
            groupRules={groupRules}
            setCustomFields={setGroupRules}
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
  );
}