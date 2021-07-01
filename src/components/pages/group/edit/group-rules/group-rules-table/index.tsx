import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import AddIcon from "@icons/add";
import { axRemoveUserGroupRule } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import GroupRules from "./group-rules-item";

const GroupRulesTable = ({ userGroupId, groupRules, setGroupRules, setIsCreate }) => {
  const { t } = useTranslation();

  const removeGroupRules = async ({ filterName, filterId }) => {
    const { success } = await axRemoveUserGroupRule(userGroupId, { filterName, filterId });
    if (success) {
      setGroupRules(groupRules.filter((item) => item.id !== filterId));
      notification(t("group:rules.remove.success"), NotificationType.Success);
    } else {
      notification(t("group:rules.remove.failure"), NotificationType.Error);
    }
  };

  return (
    <Box w="full" overflowX="auto" className="fade">
      <table style={{ minWidth: "750px" }} className="table table-bordered">
        <thead>
          <tr>
            <th>{t("group:rules.table.rule_type")}</th>
            <th>{t("group:rules.table.value")}</th>
            <th>{t("group:rules.table.actions")}</th>
          </tr>
        </thead>
        <GroupRules removeGroupRules={removeGroupRules} groupRules={groupRules} />
      </table>
      <ButtonGroup spacing={4} mt={4}>
        <Button colorScheme="blue" onClick={() => setIsCreate(true)} leftIcon={<AddIcon />}>
          {t("group:rules.add.title")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default GroupRulesTable;
