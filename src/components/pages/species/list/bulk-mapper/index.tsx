import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip
} from "@chakra-ui/react";
import { VerticalTabs } from "@components/pages/observation/list/views/list/container";
import { bulkActionTabs } from "@static/observation-list";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense, useState } from "react";

import useSpeciesList from "../use-species-list";
import GroupPost from "./actions/groupTab";

export enum bulkActions {
  unPost = "ugBulkUnPosting",
  post = "ugBulkPosting"
}

export default function BulkMapperModal() {
  const { t } = useTranslation();
  const { onClose, isOpen } = useSpeciesList();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t("observation:bulk_actions")}</DrawerHeader>
        <VerticalTabs>
          <Tabs
            isLazy={true}
            h={{ md: "100%" }}
            variant="unstyled"
            className="tabs"
            index={tabIndex}
            onChange={setTabIndex}
          >
            <TabList>
              {bulkActionTabs.map(({ name, icon, active = true }) => (
                <Tab key={name} data-hidden={!active}>
                  <Tooltip title={t(name)}>
                    <div>
                      {icon} <span>{t(name)}</span>
                    </div>
                  </Tooltip>
                </Tab>
              ))}
              <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
            </TabList>
            <TabPanels position="relative">
              <TabPanel>
                <Suspense fallback={<Spinner />}>
                  <GroupPost />
                </Suspense>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VerticalTabs>
      </DrawerContent>
    </Drawer>
  );
}
