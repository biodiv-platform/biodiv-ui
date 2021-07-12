import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { TaxonAttributesTab } from "./attributes";
import { TaxonCommonNamesTab } from "./common-names";
import { TaxonSynonymsTab } from "./synonyms";

export function TaxonModalTabs() {
  const { t } = useTranslation();

  return (
    <Tabs variant="soft-rounded" className="nospace" isLazy={true}>
      <TabList>
        <Tab>{t("taxon:modal.attributes.title")}</Tab>
        <Tab>{t("taxon:modal.synonyms")}</Tab>
        <Tab>{t("taxon:modal.common_names")}</Tab>
        <Tab>{t("taxon:modal.activity")}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <TaxonAttributesTab />
        </TabPanel>
        <TabPanel>
          <TaxonSynonymsTab />
        </TabPanel>
        <TabPanel>
          <TaxonCommonNamesTab />
        </TabPanel>
        <TabPanel>activity</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
