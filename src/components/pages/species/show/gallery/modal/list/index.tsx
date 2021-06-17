import { Box, ModalBody, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { SpeciesGalleryImage } from "./image";
import ObservationMedia from "./observation-media";

export default function SpeciesGalleryList({ resources }) {
  const { t } = useTranslation();

  return (
    <Box minH="500px">
      <ModalBody>
        <Tabs className="nospace" variant="soft-rounded" isLazy={true}>
          <TabList mb={4} overflowX="auto" py={1}>
            <Tab>✔️ {t("form:selected_media")}</Tab>
            <Tab>🖼️ {t("species:observation_media")}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SpeciesGalleryImage resources={resources} />
            </TabPanel>
            <TabPanel>
              <ObservationMedia />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>
    </Box>
  );
}
