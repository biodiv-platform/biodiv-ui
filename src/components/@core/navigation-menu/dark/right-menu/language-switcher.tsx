import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";
import { parseCookies, setCookie } from "nookies";
import React, { useEffect } from "react";

const LOCALE_COOKIE = "NEXT_LOCALE";

export default function LanguageSwitcher() {
  const { lang } = useTranslation();

  const changeLanguage = (language, force?) => {
    setCookie(null, LOCALE_COOKIE, language, {
      maxAge: 100 * 24 * 60 * 60,
      path: "/"
    });

    if (force) {
      setLanguage(language);
    }
  };

  useEffect(() => {
    const cookies = parseCookies();
    if (!cookies[LOCALE_COOKIE]) {
      changeLanguage(lang);
    }
  }, []);

  return (
    <Menu isLazy={true}>
      <MenuButton as={Link} role="button">
        {SITE_CONFIG.LANG.LIST[lang].NAME}
        <ChevronDownIcon mt={[1, 0]} float={["right", "right", "right", "none"]} />
      </MenuButton>
      <MenuList>
        {Object.entries(SITE_CONFIG.LANG.LIST).map(([langCode, info]: any) => (
          <MenuItem onClick={() => changeLanguage(langCode, true)} key={langCode}>
            {info.NAME}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
