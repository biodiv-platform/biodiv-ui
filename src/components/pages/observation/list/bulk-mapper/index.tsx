import { Box, Spinner, Tabs } from "@chakra-ui/react";
import { bulkActionTabs } from "@static/observation-list";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense, useState } from "react";

import {
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot
} from "@/components/ui/drawer";
import { Tooltip } from "@/components/ui/tooltip";

import useObservationFilter from "../../common/use-observation-filter";
import { VerticalTabs } from "../views/list/container";
import GroupPost from "./actions/groupTab";

export enum bulkActions {
  unPost = "ugBulkUnPosting",
  post = "ugBulkPosting"
}

export default function BulkMapperModal() {
  const { t } = useTranslation();
  const { onClose, isOpen } = useObservationFilter();
  const [tabIndex, setTabIndex] = useState<string | null>("common:usergroups");

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
            // variant="unstyled"
            className="tabs"
            defaultValue={tabIndex}
            onValueChange={(e) => setTabIndex(e.value)}
          >
            <Tabs.List>
              {bulkActionTabs.map(({ name, icon, active = true }) => (
                <Tabs.Trigger key={name} data-hidden={!active} value={name}>
                  <Tooltip content={t(name)}>
                    <div>
                      {icon} <span>{t(name)}</span>
                    </div>
                  </Tooltip>
                </Tabs.Trigger>
              ))}
              <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
            </Tabs.List>
            <Box position="relative">
              <Tabs.Content value="common:usergroups">
                <Suspense fallback={<Spinner />}>
                  <GroupPost />
                </Suspense>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </VerticalTabs>
      </DrawerContent>
    </DrawerRoot>
  );
}
