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
    <Menu>
      <MenuButtonA
        as={Button}
        rightIcon="chevron-down"
        variant="outline"
        variantColor="blue"
        leftIcon="download"
      >
        {t("LANDSCAPE.DOWNLOAD")}
      </MenuButtonA>
      <MenuList zIndex={4} placement="bottom-end">
        <MenuItem onClick={() => download("wkt")}>Well Known Text (WKT)</MenuItem>
        <MenuItem onClick={() => download("geojson")}>GeoJSON</MenuItem>
        <MenuItem onClick={() => download("image")}>Image</MenuItem>
      </MenuList>
    </Menu>
  );
}
