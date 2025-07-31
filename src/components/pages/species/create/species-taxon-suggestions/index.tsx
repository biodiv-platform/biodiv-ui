import { Box, Spinner, Tabs } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Tag } from "@/components/ui/tag";

import { SpeciesTaxonCreateForm } from "./create";
import useSpeciesCreate from "./create/use-species-create";
import SpeciesTaxonMatched from "./matched";
import SpeciesTaxonPartial from "./partial";

export function SpeciesTaxonSuggestions() {
  const { validateResponse, isLoading } = useSpeciesCreate();
  const { t } = useTranslation();
  const counts = {
    full: validateResponse?.matched?.length || 0,
    partial: Object.keys(validateResponse?.parentMatched || {})?.length || 0
  };

  return (
    <>
      {validateResponse && !isLoading && (
        <Box className="white-box" mb={4}>
          <Tabs.Root colorPalette="blue" lazyMount={true}>
            <Tabs.List>
              <Tabs.Trigger value="matched">
                {t("species:create.form.taxon.select")}
                <Tag colorPalette="blue" ml={2}>
                  {counts.full}
                </Tag>
              </Tabs.Trigger>
              <Tabs.Trigger value="parentMatched">
                {t("species:create.form.taxon.parent")}
                <Tag colorPalette="blue" ml={2}>
                  {counts.partial}
                </Tag>
              </Tabs.Trigger>
              <Tabs.Trigger value="createTaxon">
                {t("species:create.form.taxon.create")}
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="matched" p={4}>
              <SpeciesTaxonMatched />
            </Tabs.Content>
            <Tabs.Content value="parentMatched" p={4}>
              <SpeciesTaxonPartial />
            </Tabs.Content>
            <Tabs.Content value="createTaxon" p={4}>
              <SpeciesTaxonCreateForm />
            </Tabs.Content>
          </Tabs.Root>
        </Box>
      )}
      {isLoading && <Spinner mb={6} />}
    </>
  );
}
