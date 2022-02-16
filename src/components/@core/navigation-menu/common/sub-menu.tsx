import { Link, MenuItem, MenuList } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

const getPageLink = (lang, to) => {
  return typeof to === "string" ? to : to?.[lang] || to?.[SITE_CONFIG.LANG.DEFAULT];
};

export default function SubMenu({ rows, prefix = "" }) {
  const { t, lang } = useTranslation();
  const { isCurrentGroupMember, isLoggedIn } = useGlobalState();

  return (
    <MenuList>
      {rows.map((item) => {
        const [label, toLink] = useMemo(
          () => [item.name && t(prefix + item.name), getPageLink(lang, item.to)],
          [lang]
        );

        // explicit false check is necessary to avoid button flickr
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
