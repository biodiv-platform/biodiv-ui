import { Box, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Tag } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import React from "react";

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
          <Tabs colorScheme="blue" isLazy={true}>
            <TabList>
              <Tab>
                {t("SPECIES.CREATE.FORM.TAXON.SELECT")}
                <Tag colorScheme="blue" ml={2}>
                  {counts.full}
                </Tag>
              </Tab>
              <Tab>
                {t("SPECIES.CREATE.FORM.TAXON.PARENT")}
                <Tag colorScheme="blue" ml={2}>
                  {counts.partial}
                </Tag>
              </Tab>
              <Tab>{t("SPECIES.CREATE.FORM.TAXON.CREATE")}</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SpeciesTaxonMatched />
              </TabPanel>
              <TabPanel>
                <SpeciesTaxonPartial />
              </TabPanel>
              <TabPanel>
                <SpeciesTaxonCreateForm />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
      {isLoading && <Spinner mb={6} />}
    </>
  );
}
