import { Box, Button, MenuItem } from "@chakra-ui/react";
import DownloadIcon from "@icons/download";
import { axDownloadLandscape } from "@services/landscape.service";
import { waitForAuth } from "@utils/auth";
import { sendFileFromResponse } from "@utils/download";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuChevronUp } from "react-icons/lu";

import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu";

export default function DownloadLandscape({ id, title }) {
  const { t } = useTranslation();

  const download = async (type) => {
    await waitForAuth();
    const { success, data } = await axDownloadLandscape(id, type);
    if (success) {
      sendFileFromResponse(data, `${title}.${type}`);
    }
  };

  return (
    <Box mb={6} mr={2} position="absolute" zIndex={4} bottom={0} right={0}>
      <MenuRoot positioning={{ placement: "top-end" }}>
        <MenuTrigger
          as={Button}
          bg="white"
          // size="sm"
          // variant="outline"
          colorPalette="blue"
        >
          <DownloadIcon />
          {t("landscape:download_map")}
          <LuChevronUp />
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="wkt" onClick={() => download("wkt")}>
            Well Known Text (WKT)
          </MenuItem>
          <MenuItem value="geojson" onClick={() => download("geojson")}>
            GeoJSON
          </MenuItem>
          <MenuItem value="png" onClick={() => download("png")}>
            Image
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}
