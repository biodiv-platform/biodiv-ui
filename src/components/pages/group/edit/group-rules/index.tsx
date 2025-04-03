import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import AddGroupRulesForm from "./group-rules-form";
import GroupRulesTable from "./group-rules-table";
import { formatGroupRules } from "./utils";

export default function GroupRules({ userGroupId, rules, traits }) {
  const { t } = useTranslation();
  const [groupRules, setGroupRules] = useState(formatGroupRules(rules));
  const [isCreate, setIsCreate] = useState(false);

  return (
    <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
      <BoxHeading> 🛂 {t("group:rules.title")}</BoxHeading>
      <Box p={3}>
        {isCreate ? (
          <AddGroupRulesForm
            groupRules={groupRules}
            setGroupRules={setGroupRules}
            setIsCreate={setIsCreate}
            traits = {traits}
          />
        ) : (
          <GroupRulesTable
            userGroupId={userGroupId}
            groupRules={groupRules}
            setGroupRules={setGroupRules}
            setIsCreate={setIsCreate}
          />
        )}
      </Box>
    </Box>
  );
}
