import { Box, Button, ButtonGroup } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axRemoveCustomField } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

import GroupRules from "./group-rules-item";

const CustomFieldTable = ({ userGroupId, groupRules, setGroupRules, setIsCreate }) => {
  const { t } = useTranslation();

  const removeGroupRules = async (index) => {
    const { success } = await axRemoveCustomField(userGroupId, index);
    if (success) {
      setGroupRules(groupRules);
      notification(t("GROUP.CUSTOM_FIELD.REMOVE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.CUSTOM_FIELD.REMOVE.FAILURE"), NotificationType.Error);
    }
  };

  return (
    <Box w="full" overflowX="auto" className="fade">
      <table style={{ minWidth: "750px" }} className="table table-bordered">
        <thead>
          <tr>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.NAME")}</th>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.DATA_TYPE")}</th>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.INPUT_TYPE")}</th>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.ACTIONS")}</th>
          </tr>
        </thead>
        <GroupRules removeCustomField={removeGroupRules} groupRules={groupRules} />
      </table>
      <ButtonGroup spacing={4} mt={4}>
        <Button variantColor="blue" onClick={() => setIsCreate(true)} leftIcon="add">
          {t("GROUP.CUSTOM_FIELD.CREATE")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default CustomFieldTable;
