import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
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
      <Menu>
        <MenuButton
          as={Button}
          // @ts-ignore
          rightIcon="chevron-up"
          leftIcon="download"
          bg="white"
          size="sm"
          variant="outline"
          variantColor="blue"
        >
          {t("LANDSCAPE.DOWNLOAD_MAP")}
        </MenuButton>
        <MenuList placement="top-end">
          <MenuItem onClick={() => download("wkt")}>Well Known Text (WKT)</MenuItem>
          <MenuItem onClick={() => download("geojson")}>GeoJSON</MenuItem>
          <MenuItem onClick={() => download("image")}>Image</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
