import { Box, Spinner, Tabs } from "@chakra-ui/react";
import { VerticalTabs } from "@components/pages/observation/list/views/list/container";
import { bulkActionTabs } from "@static/observation-list";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense } from "react";

import {
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot
} from "@/components/ui/drawer";
import { Tooltip } from "@/components/ui/tooltip";

import useSpeciesList from "../use-species-list";
import GroupPost from "./actions/groupTab";

export enum bulkActions {
  unPost = "ugBulkUnPosting",
  post = "ugBulkPosting"
}

export default function BulkMapperModal() {
  const { t } = useTranslation();
  const { onClose, isOpen } = useSpeciesList();

  return (
    <DrawerRoot placement="bottom" onOpenChange={onClose} open={isOpen}>
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerCloseTrigger />
        <DrawerHeader>{t("observation:bulk_actions")}</DrawerHeader>
        <VerticalTabs>
          <Tabs.Root
            lazyMount={true}
            h={{ md: "100%" }}
            className="tabs"
            defaultValue={"common:usergroups"}
          >
            <Tabs.List>
              {bulkActionTabs.map(({ name, icon, active = true }) => (
                <Tabs.Trigger value={name} key={name} data-hidden={!active}>
                  <Tooltip content={t(name)}>
                    <div>
                      {icon} <span>{t(name)}</span>
                    </div>
                  </Tooltip>
                </Tabs.Trigger>
              ))}
              <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
            </Tabs.List>
            <Tabs.Content
              value="common:usergroups"
              height="100%"
              className="tab-content"
              position="relative"
              style={{ overflow: "hidden" }}
            >
              <Box height="100%" overflowY="auto">
                <Suspense fallback={<Spinner />}>
                  <GroupPost />
                </Suspense>
              </Box>
            </Tabs.Content>
          </Tabs.Root>
        </VerticalTabs>
      </DrawerContent>
    </DrawerRoot>
  );
}
