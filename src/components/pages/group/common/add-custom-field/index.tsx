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
import AddCustomFieldForm from "./custom-field-form";
import useTranslation from "@configs/i18n/useTranslation";
import CustomFieldList from "./custom-field-list";
import React, { useState } from "react";

export default function AddCustomField({ userGroupId, customFieldList }) {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [list, setList] = useState(customFieldList);
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
            <TabPanel>
              <CustomFieldList userGroupId={userGroupId} customFieldList={list} />
            </TabPanel>
            <TabPanel>
              <AddCustomFieldForm updateCustomFieldList={handleTabsChange} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </AccordionPanel>
    </AccordionItem>
  );
}
