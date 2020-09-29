import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/core";
import { ChevronUpIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import DownloadIcon from "@icons/download";
import { axDownloadLandscape } from "@services/landscape.service";
import { waitForAuth } from "@utils/auth";
import { sendFileFromResponse } from "@utils/download";
import React from "react";

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
      <Menu placement="top-end">
        <MenuButton
          as={Button}
          rightIcon={<ChevronUpIcon />}
          leftIcon={<DownloadIcon />}
          bg="white"
          size="sm"
          variant="outline"
          colorScheme="blue"
        >
          {t("LANDSCAPE.DOWNLOAD_MAP")}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => download("wkt")}>Well Known Text (WKT)</MenuItem>
          <MenuItem onClick={() => download("geojson")}>GeoJSON</MenuItem>
          <MenuItem onClick={() => download("png")}>Image</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
