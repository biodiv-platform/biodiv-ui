import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Flex, Image, Link, MenuItem, MenuList, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const GroupListItem = ({ isOpen }) => {
  const { groups, currentGroup } = useGlobalState();
  const { t } = useTranslation();
  const removePrefix = currentGroup.webAddress?.startsWith(SITE_CONFIG.SITE.URL);

  return (
    <MenuList h="18rem" maxW="360px" w="90%" overflowY="scroll">
      <MenuItem minH="3rem">
        <LocalLink href="/group/list" prefixGroup={true}>
          <Link w="full">
            {t("header:menu_primary.groups.see_all")} <ArrowForwardIcon />
          </Link>
        </LocalLink>
      </MenuItem>
      {isOpen &&
        groups?.map((g) => {
          const groupURL: any = removePrefix
            ? g?.webAddress?.replace(SITE_CONFIG.SITE.URL, "")
            : g?.webAddress;

          return (
            <MenuItem key={g.id} minH="3rem">
              <LocalLink href={groupURL}>
                <Link w="full">
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
              </LocalLink>
            </MenuItem>
          );
        })}
    </MenuList>
  );
};

export default GroupListItem;
