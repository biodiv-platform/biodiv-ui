import { Box, Menu } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const getPageLink = (lang, to) => {
  return typeof to === "string" ? to : to?.[lang] || to?.[SITE_CONFIG.LANG.DEFAULT];
};

export default function SubMenu({ rows, prefix = "", isPage = false }) {
  const { t, lang } = useTranslation();
  const { isCurrentGroupMember, isLoggedIn, currentGroup, open, setOpen } = useGlobalState();

  return (
    <Menu.Content>
      {rows
        .filter((item) => !(item.name === "about_us" && currentGroup?.id))
        .map((item) => {
          const label = item.name && t(isPage ? item.name : prefix + item.name);
          const toLink = getPageLink(lang, item.to);

          return (
            <Menu.Item key={item.name} value={item.name} asChild>
              {isLoggedIn && item.memberOnly && isCurrentGroupMember === false ? (
                <a onClick={() => notification(t("header:member_only"))}>{label}</a>
              ): item.name == "my_notifications"? (
                <Box onClick={()=> setOpen(true)}>
                  {label}
                  {!open && (
                    <Box w="8px" h="8px" bg="red.500" borderRadius="full" ml={2} />
                  )}
                </Box>
              ) : (
                <LocalLink href={toLink} params={item.params} prefixGroup={true}>
                  {label}
                </LocalLink>
              )}
            </Menu.Item>
          );
        })}
    </Menu.Content>
  );
}
