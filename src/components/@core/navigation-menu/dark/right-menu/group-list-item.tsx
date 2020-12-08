import { Flex, Image, Link, MenuItem, MenuList, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import useGlobalState from "@hooks/use-global-state";
import { getGroupLink } from "@utils/basic";
import React from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const GroupListItem = ({ isOpen }) => {
  const { groups } = useGlobalState();
  const { t } = useTranslation();

  return (
    <MenuList h="18rem" maxW="360px" w="90%" overflowY="scroll">
      <MenuItem minH="3rem">
        <LocalLink href="/group/list" prefixGroup={true}>
          <Link w="full">
            {t("HEADER.MENU_PRIMARY.GROUPS.SEE_ALL")} <ArrowForwardIcon />
          </Link>
        </LocalLink>
      </MenuItem>
      {isOpen &&
        groups?.map((g) => (
          <MenuItem key={g.id} minH="3rem">
            <Link w="full" href={getGroupLink(g.webAddress)}>
              <Flex alignItems="center">
                <Image
                  boxSize="2rem"
                  objectFit="contain"
                  loading="lazy"
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
