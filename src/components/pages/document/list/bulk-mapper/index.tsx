import {
  ActionBar,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Collapsible,
  Portal,
  Spinner,
  Tabs,
  Text,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import { bulkActionTabs } from "@static/observation-list";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense, useEffect, useState } from "react";
import { LuCircleCheck, LuRepeat } from "react-icons/lu";

import { Tooltip } from "@/components/ui/tooltip";

import useDocumentFilter from "../../common/use-document-filter";
import GroupPost from "./actions/groupTab";

export enum bulkActions {
  unPost = "ugBulkUnPosting",
  post = "ugBulkPosting"
}

export default function BulkMapperModal() {
  const isSmall = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState<string | null>("common:usergroups");
  const { onClose, isOpen, bulkDocumentsIds, onOpen, selectAll, documentData, handleBulkCheckbox } =
    useDocumentFilter();
  const { open: isContentVisible, onToggle: toggleContentVisibility } = useDisclosure({
    defaultOpen: false
  });
  useEffect(() => {
    if (bulkDocumentsIds && bulkDocumentsIds?.length > 0 && !isOpen) {
      onOpen();
    }
    if (bulkDocumentsIds && bulkDocumentsIds?.length == 0 && isOpen) {
      onClose();
    }
  }, [bulkDocumentsIds]);

  const handleSelectAll = () => {
    alert(`${documentData.n} ${t("document:select_all")}`);
    handleBulkCheckbox("selectAll");
  };

  return (
    <ActionBar.Root open={isOpen} closeOnInteractOutside={false} onOpenChange={onClose}>
      <Portal>
        <ActionBar.Positioner
          css={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            zIndex: 1000
          }}
        >
          <ActionBar.Content
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-start"}
            width="full"
            background={"#F0FDFA"}
            boxShadow={
              "0 -20px 60px rgba(0, 0, 0, 0.25), 0 -8px 20px rgba(0, 0, 0, 0.2), inset 0 3px 0 rgba(0, 0, 0, 0.2)"
            }
          >
            <Collapsible.Root width={"full"}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
                width={"full"}
              >
                <Text fontWeight={"bold"} fontSize={"2xl"}>
                  Bulk Actions
                </Text>
                <Box alignItems="end" ml="auto" justifyContent={"flex-end"}>
                  <ActionBar.SelectionTrigger m={2}>
                    {selectAll ? documentData.n : bulkDocumentsIds?.length}{" "}
                    {t("observation:bulk_actions_selected")}
                  </ActionBar.SelectionTrigger>
                  <ButtonGroup size="sm" variant="outline">
                    {!isSmall && (
                      <>
                        {!selectAll && (
                          <Button variant="solid" colorPalette="blue" onClick={handleSelectAll}>
                            <LuCircleCheck />
                            {t("observation:select_all")}
                          </Button>
                        )}
                        <Button
                          variant="solid"
                          colorPalette="red"
                          onClick={() => handleBulkCheckbox("UnsSelectAll")}
                        >
                          <LuRepeat />
                          {t("observation:unselect")}
                        </Button>
                        <Collapsible.Trigger>
                          <Button
                            onClick={toggleContentVisibility}
                            variant={"solid"}
                            colorPalette={"green"}
                          >
                            {isContentVisible ? "Hide actions" : "Show actions"}
                          </Button>
                        </Collapsible.Trigger>
                      </>
                    )}
                    <ActionBar.CloseTrigger asChild mr={4}>
                      <CloseButton size="sm" onClick={toggleContentVisibility} />
                    </ActionBar.CloseTrigger>
                  </ButtonGroup>
                </Box>
              </Box>
              <Box justifyContent="flex-start" width={"full"}>
                {isSmall && (
                  <ButtonGroup size="sm" variant="outline" mb={4}>
                    {!selectAll && (
                      <Button variant="solid" colorPalette="blue" onClick={handleSelectAll}>
                        <LuCircleCheck />
                        {t("observation:select_all")}
                      </Button>
                    )}
                    <Button
                      variant="solid"
                      colorPalette="red"
                      onClick={() => handleBulkCheckbox("UnsSelectAll")}
                    >
                      <LuRepeat />
                      {t("observation:unselect")}
                    </Button>
                    <Collapsible.Trigger>
                      <Button
                        onClick={toggleContentVisibility}
                        variant={"solid"}
                        colorPalette={"green"}
                      >
                        {isContentVisible ? "Hide actions" : "Show actions"}
                      </Button>
                    </Collapsible.Trigger>
                  </ButtonGroup>
                )}
                <Tabs.Root
                  lazyMount={true}
                  h={{ md: "100%" }}
                  className="tabs"
                  defaultValue={tabIndex}
                  onValueChange={(e) => setTabIndex(e.value)}
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
                  <Box position="relative">
                    <Collapsible.Content>
                      <Tabs.Content value="common:usergroups">
                        <Suspense fallback={<Spinner />}>
                          <GroupPost />
                        </Suspense>
                      </Tabs.Content>
                    </Collapsible.Content>
                  </Box>
                </Tabs.Root>
              </Box>
            </Collapsible.Root>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
