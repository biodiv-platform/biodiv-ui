import { Box } from "@chakra-ui/react";
import React, { useState } from "react";

import AddGroupRulesForm from "./group-rules-form";
import GroupRulesTable from "./group-rules-table";
import { formatGroupRules } from "./utils";

export default function GroupRules({ userGroupId, rules, traits }) {
  const [groupRules, setGroupRules] = useState(formatGroupRules(rules, traits));
  const [isCreate, setIsCreate] = useState(false);

  return (
    <Box p={3}>
      {isCreate ? (
        <AddGroupRulesForm
          groupRules={groupRules}
          setGroupRules={setGroupRules}
          setIsCreate={setIsCreate}
          traits={traits}
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
  );
}
