import { Menu } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import { getPagesMenu } from "@utils/pages";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

const SubMenuLink = ({ item, onClose }) => (
  <>
    <Menu.Item
      asChild
      w="full"
      onClick={onClose}
      fontWeight={item?.rows ? "bold" : "normal"}
      value={item.to}
    >
      <LocalLink href={item.to} params={item.params} prefixGroup={true}>
        {item.name}
      </LocalLink>
    </Menu.Item>
    {item?.rows && item.rows.map((i) => <SubMenuLink item={i} onClose={onClose} key={i.name} />)}
    {item?.rows && <Menu.Separator />}
  </>
);

export default function PagesMenuItem({ onClose }) {
  const { pages, currentGroup } = useGlobalState();
  const { t } = useTranslation();
  const pagesMenu = useMemo(() => {
    const menu = getPagesMenu(pages);
    return currentGroup?.id
      ? [...menu, { name: t("header:menu_secondary.more.about_us"), to: "/about" }]
      : menu;
  }, [pages]);

  return (
    <Menu.Content maxH="18.5rem" overflow="auto">
      {pages.length ? (
        pagesMenu.map((item) => <SubMenuLink item={item} onClose={onClose} key={item.name} />)
      ) : (
        <>
          {pagesMenu.map((item) => (
            <SubMenuLink item={item} onClose={onClose} key={item.name} />
          ))}
          <Menu.Item asChild w="full" onClick={onClose} value={"noPage"}>
            <LocalLink prefixGroup={true} href="/page/empty">
              {t("header:menu_secondary.pages.empty")}
            </LocalLink>
          </Menu.Item>
        </>
      )}
    </Menu.Content>
  );
}
