import { Tabs } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";

import { TaxonActivityTab } from "./activity";
import { TaxonAttributesTab } from "./attributes";
import { TaxonCommonNamesTab } from "./common-names";
import { TaxonSynonymsTab } from "./synonyms";

export function TaxonModalTabs() {
  const { t } = useTranslation();

  return (
    <Tabs.Root className="nospace" lazyMount defaultValue={"attributes"}>
      <Tabs.List
        overflowX="auto"
        whiteSpace="nowrap"
        maxW="100%"
        css={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        <Tabs.Trigger flexShrink={0} value="attributes">
          {t("taxon:modal.attributes.title")}
        </Tabs.Trigger>
        <Tabs.Trigger flexShrink={0} value="synonyms">
          {t("taxon:modal.synonyms")}
        </Tabs.Trigger>
        <Tabs.Trigger flexShrink={0} value="commonNames">
          {t("taxon:modal.common_names")}
        </Tabs.Trigger>
        <Tabs.Trigger flexShrink={0} value="activity">
          {t("taxon:modal.activity")}
        </Tabs.Trigger>
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
