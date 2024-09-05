import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import useGlobalState from "@hooks/use-global-state";
import { adminOrAuthor } from "@utils/auth";
import React, { useMemo } from "react";

import { ICustomFieldsProps } from ".";
import CustomField from "./field";

export default function CustomFieldList({
  o,
  observationId,
  setO,
  cfPermission
}: ICustomFieldsProps) {
  const { groups, user, currentGroup } = useGlobalState();

  const getGroupNameById = (gId) => useMemo(() => groups?.find((g) => g.id === gId)?.name, [gId]);

  const getGroupPermissionsByGroupId = (gId) => {
    return cfPermission?.find((cfp) => cfp.userGroupId === gId)?.allowedCfId || [];
  };

  const defaultTabIndex = currentGroup?.id
    ? o.customField
      ? o.customField.findIndex((cf) => cf.userGroupId === currentGroup.id)
      : 0
    : 0;

  return (
    <Tabs className="nospace" isLazy={true} defaultIndex={defaultTabIndex}>
      <TabList>
        {o.customField?.map(({ userGroupId }) => (
          <Tab key={userGroupId}>{getGroupNameById(userGroupId)}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {o.customField?.map((cfList) => (
          <TabPanel key={cfList.userGroupId}>
            {cfList?.customField?.map((cf) => (
              <CustomField
                key={cf.cfId}
                cf={cf}
                userGroupId={cfList.userGroupId}
                observationId={observationId}
                setO={setO}
                canEdit={
                  adminOrAuthor(user?.id) &&
                  cf.cfId &&
                  getGroupPermissionsByGroupId(cfList.userGroupId).includes(cf.cfId)
                }
              />
            ))}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
