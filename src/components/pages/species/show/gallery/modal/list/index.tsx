import { Box, Tabs } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { DialogBody } from "@/components/ui/dialog";

import { SpeciesGalleryImage } from "./image";
import ObservationMedia from "./observation-media";

export default function SpeciesGalleryList({ resources }) {
  const { t } = useTranslation();

  return (
    <Box minH="500px">
      <DialogBody>
        <Tabs.Root className="nospace" lazyMount={true}>
          <Tabs.List mb={4} overflowX="auto" py={1}>
            <Tabs.Trigger value="selectedMedia">✔️ {t("form:selected_media")}</Tabs.Trigger>
            <Tabs.Trigger value="obeservationMedia">
              🖼️ {t("species:observation_media")}
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="selectedMedia">
            <SpeciesGalleryImage resources={resources} />
          </Tabs.Content>
          <Tabs.Content value="obeservationMedia">
            <ObservationMedia />
          </Tabs.Content>
        </Tabs.Root>
      </DialogBody>
    </Box>
  );
}
