import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axDownloadLandscape } from "@services/landscape.service";
import { waitForAuth } from "@utils/auth";
import React from "react";

const MenuButtonA: any = MenuButton;

export default function DownloadLandscape({ id, title }) {
  const { t } = useTranslation();

  const download = async (type) => {
    await waitForAuth();
    const { success, data } = await axDownloadLandscape(id, type);
    if (success) {
      var a = document.createElement("a");
      document.body.appendChild(a);
      const blob = new Blob([data], { type: "octet/stream" });
      const blobUrl = window.URL.createObjectURL(blob);
      a.href = blobUrl;
      a.download = `${title}.${type}`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    }
  };

  return (
    <Box position="absolute" pb={6} px={2} bottom={0} right={0}>
      <Menu>
        <MenuButtonA
          as={Button}
          bg="white"
          size="sm"
          rightIcon="chevron-up"
          variant="outline"
          variantColor="blue"
          leftIcon="download"
        >
          {t("LANDSCAPE.DOWNLOAD_MAP")}
        </MenuButtonA>
        <MenuList zIndex={4} placement="top-end">
          <MenuItem onClick={() => download("wkt")}>Well Known Text (WKT)</MenuItem>
          <MenuItem onClick={() => download("geojson")}>GeoJSON</MenuItem>
          <MenuItem onClick={() => download("png")}>Image</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}
