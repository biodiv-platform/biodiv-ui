import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { ENDPOINT } from "@static/constants";
import React from "react";

const MenuButtonA: any = MenuButton;

export default function DownloadLandscape({ id }) {
  const { t } = useTranslation();

  const download = (type) => {
    window.location.assign(
      `${ENDPOINT.LANDSCAPE}/landscape/download?protectedAreaId=${id}&type=${type}`
    );
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
