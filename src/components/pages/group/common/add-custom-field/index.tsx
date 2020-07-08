import {
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React, { useState } from "react";

import AddCustomFieldForm from "./custom-field-form";
import CustomFieldList from "./custom-field-list";

export default function GroupCustomField({ userGroupId, groupCustomField, allCustomField }) {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [list, setList] = useState(groupCustomField || []);

  const handleTabsChange = (index, latestCustomField?: any) => {
    if (latestCustomField) {
      setList(latestCustomField);
    }
    setTabIndex(index);
  };

  return (
    <AccordionItem mb={8} bg="white" border="1px solid" borderColor="gray.300" borderRadius="md">
      <AccordionHeader _expanded={{ bg: "gray.100" }}>
        <Heading as="h2" flex="1" textAlign="left" my={1} size="lg">
          📜 {t("GROUP.CUSTOM_FIELD.TITLE")}
        </Heading>
        <AccordionIcon float="right" />
      </AccordionHeader>

      <AccordionPanel>
        <Tabs index={tabIndex} onChange={handleTabsChange} isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>View</Tab>
            <Tab>Add</Tab>
          </TabList>
          <TabPanels>
            <TabPanel overflow="scroll">
              {tabIndex === 0 && (
                <CustomFieldList
                  userGroupId={userGroupId}
                  setCustomFieldList={setList}
                  customFieldList={list}
                />
              )}
            </TabPanel>
            <TabPanel>
              {tabIndex === 1 && (
                <AddCustomFieldForm
                  existingCustomField={list}
                  allCustomField={allCustomField}
                  updateCustomFieldList={handleTabsChange}
                />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </AccordionPanel>
    </AccordionItem>
  );
}
