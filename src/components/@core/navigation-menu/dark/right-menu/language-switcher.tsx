import { Button, Flex } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";
import { parseCookies, setCookie } from "nookies";
import React, { useEffect } from "react";
import { LuChevronDown } from "react-icons/lu";

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
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
    <MenuRoot>
      <MenuTrigger asChild>
        <Button
          variant="plain"
          size="lg"
          color="inherit"
          px={0}
          width={{ base: "100%", lg: "auto" }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex align="center" gap={2}>
            {SITE_CONFIG.LANG.LIST[lang].NAME}
          </Flex>
          <LuChevronDown style={{ marginLeft: "auto" }} />
        </Button>
      </MenuTrigger>
      <MenuContent>
        {Object.entries(SITE_CONFIG.LANG.LIST).map(([langCode, info]: any) => (
          <MenuItem onClick={() => changeLanguage(langCode, true)} key={langCode} value={langCode}>
            {info.NAME}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
}
