import { Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import { MenuContent, MenuItem, MenuItemGroup, MenuSeparator } from "@/components/ui/menu";

const getPageLink = (lang, to) => {
  return typeof to === "string" ? to : to?.[lang] || to?.[SITE_CONFIG.LANG.DEFAULT];
};

const MenuGroupItems = ({
  rows,
  prefix = "",
  translate,
  lang,
  isCurrentGroupMember,
  isLoggedIn
}) => {
  return (
    <>
      {rows.map((item) => {
        const [label, toLink] = useMemo(
          () => [item.name && translate(prefix + item.name), getPageLink(lang, item.to)],
          [lang]
        );

        // explicit false check is necessary to avoid button flickr
        return (
          <MenuItem key={item.name} value={item.name}>
            {isLoggedIn && item.memberOnly && isCurrentGroupMember === false ? (
              <a onClick={() => notification(translate("header:member_only"))}>{label}</a>
            ) : (
              <LocalLink href={toLink} params={item.params} prefixGroup={true}>
                <Link>{label}</Link>
              </LocalLink>
            )}
          </MenuItem>
        );
      })}
    </>
  );
};

export default function GroupedSubMenu({ rows, prefix = "" }) {
  const { t, lang } = useTranslation();
  const { isCurrentGroupMember, isLoggedIn } = useGlobalState();

  const observationRows = rows.filter((r) => r.group === "observations" && r.active == true);
  const speciesRows = rows.filter((r) => r.group === "species" && r.active == true);
  const mapRows = rows.filter((r) => r.group === "map" && r.active == true);
  const documentRows = rows.filter((r) => r.group === "document" && r.active == true);

  return (
    <MenuContent>
      {observationRows.length > 0 && (
        <div>
          <MenuItemGroup
            title={t("header:menu_primary.contribute.grouped_menu_title.observations")}
            height="full"
          >
            <MenuGroupItems
              rows={observationRows}
              prefix={prefix}
              translate={t}
              lang={lang}
              isCurrentGroupMember={isCurrentGroupMember}
              isLoggedIn={isLoggedIn}
            />
          </MenuItemGroup>
          <MenuSeparator />
        </div>
      )}

      {speciesRows.length > 0 && (
        <div>
          <MenuItemGroup title={t("header:menu_primary.contribute.grouped_menu_title.species")}>
            <MenuGroupItems
              rows={speciesRows}
              prefix={prefix}
              translate={t}
              lang={lang}
              isCurrentGroupMember={isCurrentGroupMember}
              isLoggedIn={isLoggedIn}
            />
          </MenuItemGroup>

          <MenuSeparator />
        </div>
      )}

      {mapRows.length > 0 && (
        <div>
          <MenuItemGroup title={t("header:menu_primary.contribute.grouped_menu_title.maps")}>
            <MenuGroupItems
              rows={mapRows}
              prefix={prefix}
              translate={t}
              lang={lang}
              isCurrentGroupMember={isCurrentGroupMember}
              isLoggedIn={isLoggedIn}
            />
          </MenuItemGroup>

          <MenuSeparator />
        </div>
      )}

      {documentRows.length > 0 && (
        <MenuItemGroup title={t("header:menu_primary.contribute.grouped_menu_title.documents")}>
          <MenuGroupItems
            rows={documentRows}
            prefix={prefix}
            translate={t}
            lang={lang}
            isCurrentGroupMember={isCurrentGroupMember}
            isLoggedIn={isLoggedIn}
          />
        </MenuItemGroup>
      )}
    </MenuContent>
  );
}
