import { Box, Button, ButtonGroup } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axRemoveUserGroupRule } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

import GroupRules from "./group-rules-item";

const GroupRulesTable = ({ userGroupId, groupRules, setGroupRules, setIsCreate }) => {
  const { t } = useTranslation();

  const removeGroupRules = async ({ filterName, filterId }) => {
    const { success } = await axRemoveUserGroupRule(userGroupId, { filterName, filterId });
    if (success) {
      setGroupRules(groupRules.filter((item) => item.id !== filterId));
      notification(t("GROUP.RULES.REMOVE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.RULES.REMOVE.FAILURE"), NotificationType.Error);
    }
  };

  return (
    <Box w="full" overflowX="auto" className="fade">
      <table style={{ minWidth: "750px" }} className="table table-bordered">
        <thead>
          <tr>
            <th>{t("GROUP.RULES.TABLE.RULE_TYPE")}</th>
            <th>{t("GROUP.RULES.TABLE.VALUE")}</th>
            <th>{t("GROUP.RULES.TABLE.ACTIONS")}</th>
          </tr>
        </thead>
        <GroupRules removeGroupRules={removeGroupRules} groupRules={groupRules} />
      </table>
      <ButtonGroup spacing={4} mt={4}>
        <Button variantColor="blue" onClick={() => setIsCreate(true)} leftIcon="add">
          {t("GROUP.RULES.ADD.TITLE")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default GroupRulesTable;
