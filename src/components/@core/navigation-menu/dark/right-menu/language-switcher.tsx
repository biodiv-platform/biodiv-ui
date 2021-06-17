import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function LanguageSwitcher() {
  const { lang } = useTranslation();

  const changeLanguage = (language) => {
    setLanguage(language);
  };

  return (
    <Menu>
      <MenuButton as={Link} role="button" rightIcon={<ChevronDownIcon />}>
        {lang.toUpperCase()}
      </MenuButton>
      <MenuList>
        {Object.entries(SITE_CONFIG.LANG.LIST).map(([langCode, info]: any) => (
          <MenuItem onClick={() => changeLanguage(langCode)} key={langCode}>
            {info.NAME}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
