import { Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import { MenuContent, MenuItem } from "@/components/ui/menu";

const getPageLink = (lang, to) => {
  return typeof to === "string" ? to : to?.[lang] || to?.[SITE_CONFIG.LANG.DEFAULT];
};

export default function SubMenu({ rows, prefix = "", isPage = false }) {
  const { t, lang } = useTranslation();
  const { isCurrentGroupMember, isLoggedIn } = useGlobalState();

  return (
    <MenuContent>
      {rows.map((item) => {
        const [label, toLink] = useMemo(
          () => [
            item.name && t(isPage ? item.name : prefix + item.name),
            getPageLink(lang, item.to)
          ],
          [lang]
        );

        // explicit false check is necessary to avoid button flickr
        return (
          <MenuItem key={item.name} value={item.name}>
            {isLoggedIn && item.memberOnly && isCurrentGroupMember === false ? (
              <a onClick={() => notification(t("header:member_only"))}>{label}</a>
            ) : (
              <LocalLink href={toLink} params={item.params} prefixGroup={true}>
                <Link>{label}</Link>
              </LocalLink>
            )}
          </MenuItem>
        );
      })}
    </MenuContent>
  );
}
