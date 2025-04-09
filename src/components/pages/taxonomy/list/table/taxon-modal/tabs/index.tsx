import { Tabs } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { TaxonActivityTab } from "./activity";
import { TaxonAttributesTab } from "./attributes";
import { TaxonCommonNamesTab } from "./common-names";
import { TaxonSynonymsTab } from "./synonyms";

export function TaxonModalTabs() {
  const { t } = useTranslation();

  return (
    <Tabs.Root className="nospace" lazyMount>
      <Tabs.List>
        <Tabs.Trigger value="attributes">{t("taxon:modal.attributes.title")}</Tabs.Trigger>
        <Tabs.Trigger value="synonyms">{t("taxon:modal.synonyms")}</Tabs.Trigger>
        <Tabs.Trigger value="commonNames">{t("taxon:modal.common_names")}</Tabs.Trigger>
        <Tabs.Trigger value="activity">{t("taxon:modal.activity")}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="attributes">
        <TaxonAttributesTab />
      </Tabs.Content>
      <Tabs.Content value="synonyms">
        <TaxonSynonymsTab />
      </Tabs.Content>
      <Tabs.Content value="commonNames">
        <TaxonCommonNamesTab />
      </Tabs.Content>
      <Tabs.Content value="activity">
        <TaxonActivityTab />
      </Tabs.Content>
    </Tabs.Root>
  );
}
