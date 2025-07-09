import { Link, MenuItem, MenuList } from "@chakra-ui/react";
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
  const { isCurrentGroupMember, isLoggedIn, currentGroup } = useGlobalState();

  return (
    <MenuList>
      {rows.filter((item) => !(item.name === "about_us" && currentGroup?.id)).map((item) => {
        const label = item.name && t(isPage ? item.name : prefix + item.name);
        const toLink = getPageLink(lang, item.to);

        return (
          <MenuItem key={item.name}>
            {isLoggedIn && item.memberOnly && isCurrentGroupMember === false ? (
              <Link w="full" onClick={() => notification(t("header:member_only"))}>
                {label}
              </Link>
            ) : (
              <LocalLink href={toLink} params={item.params} prefixGroup={true}>
                <Link w="full">{label}</Link>
              </LocalLink>
            )}
          </MenuItem>
        );
      })}
    </MenuList>
  );
}
