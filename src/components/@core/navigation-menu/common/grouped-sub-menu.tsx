import { Menu } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

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
          <Menu.Item key={item.name} value={item.name} asChild>
            {isLoggedIn && item.memberOnly && isCurrentGroupMember === false ? (
              <a onClick={() => notification(translate("header:member_only"))}>{label}</a>
            ) : (
              <LocalLink href={toLink} params={item.params} prefixGroup={true}>
                {label}
              </LocalLink>
            )}
          </Menu.Item>
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
    <Menu.Content>
      {observationRows.length > 0 && (
        <div>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>
              {t("header:menu_primary.contribute.grouped_menu_title.observations")}
            </Menu.ItemGroupLabel>
            <MenuGroupItems
              rows={observationRows}
              prefix={prefix}
              translate={t}
              lang={lang}
              isCurrentGroupMember={isCurrentGroupMember}
              isLoggedIn={isLoggedIn}
            />
          </Menu.ItemGroup>
          <Menu.Separator />
        </div>
      )}

      {speciesRows.length > 0 && (
        <div>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>
              {t("header:menu_primary.contribute.grouped_menu_title.species")}
            </Menu.ItemGroupLabel>
            <MenuGroupItems
              rows={speciesRows}
              prefix={prefix}
              translate={t}
              lang={lang}
              isCurrentGroupMember={isCurrentGroupMember}
              isLoggedIn={isLoggedIn}
            />
          </Menu.ItemGroup>

          <Menu.Separator />
        </div>
      )}

      {mapRows.length > 0 && (
        <div>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>
              {t("header:menu_primary.contribute.grouped_menu_title.maps")}
            </Menu.ItemGroupLabel>
            <MenuGroupItems
              rows={mapRows}
              prefix={prefix}
              translate={t}
              lang={lang}
              isCurrentGroupMember={isCurrentGroupMember}
              isLoggedIn={isLoggedIn}
            />
          </Menu.ItemGroup>

          <Menu.Separator />
        </div>
      )}

      {documentRows.length > 0 && (
        <Menu.ItemGroup>
          <Menu.ItemGroupLabel>
            {t("header:menu_primary.contribute.grouped_menu_title.documents")}
          </Menu.ItemGroupLabel>
          <MenuGroupItems
            rows={documentRows}
            prefix={prefix}
            translate={t}
            lang={lang}
            isCurrentGroupMember={isCurrentGroupMember}
            isLoggedIn={isLoggedIn}
          />
        </Menu.ItemGroup>
      )}
    </Menu.Content>
  );
}
