import { Box, ModalBody, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
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
            <Tab>✔️ {t("OBSERVATION.SELECTED_MEDIA")}</Tab>
            <Tab>🖼️ {t("SPECIES.OBSERVATION_MEDIA")}</Tab>
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
