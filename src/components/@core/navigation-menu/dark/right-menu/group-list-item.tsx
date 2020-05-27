import { Flex, Image, Link, MenuItem, MenuList, Text } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import { UserGroupIbp } from "@interfaces/observation";
import { getGroupLink } from "@utils/basic";
import { useStoreState } from "easy-peasy";
import React from "react";

const GroupListItem = () => {
  const groups: UserGroupIbp[] = useStoreState((state) => state.groups);
  const { t } = useTranslation();

  return (
    <MenuList h="18rem" maxW="360px" w="90%" overflowY="scroll" placement="bottom-end">
      <MenuItem minH="3rem">
        <LocalLink href="/group/list" prefixGroup={true}>
          <Link w="full">{t("HEADER.MENU_PRIMARY.GROUPS.SEE_ALL")}</Link>
        </LocalLink>
      </MenuItem>
      {groups?.map((g) => (
        <MenuItem key={g.id} minH="3rem">
          <Link w="full" href={getGroupLink(g.webAddress)}>
            <Flex alignItems="center">
              <Image
                size="2rem"
                objectFit="contain"
                src={`${g.icon}?w=40`}
                aria-label={`${g.name} Logo`}
                mr={2}
              />
              <Text lineHeight="1rem">{g.name}</Text>
            </Flex>
          </Link>
        </MenuItem>
      ))}
    </MenuList>
  );
};

export default GroupListItem;
