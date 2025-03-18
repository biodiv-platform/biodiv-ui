import { Box, Flex, Image, Input, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import debounce from "debounce-promise";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { LuArrowRight } from "react-icons/lu";

import { MenuContent, MenuItem } from "@/components/ui/menu";

const GroupListItem = () => {
  const { groups, currentGroup } = useGlobalState();
  const { t } = useTranslation();
  const removePrefix = currentGroup.webAddress?.startsWith(SITE_CONFIG.SITE.URL);
  const [filterGroups, setFilterGroups] = useState<any>(groups);

  const onQuery = debounce((e) => {
    setFilterGroups(
      groups?.filter((i) => i.name?.toLowerCase().match(e.target.value.toLowerCase()))
    );
  }, 200);

  return (
    <MenuContent h="18rem" w="360px" overflowY="scroll">
      <Box px={2}>
        <Input w="full" onChange={onQuery} placeholder={t("header:search")} />
      </Box>
      <MenuItem minH="3rem" value="seeAll">
        <LocalLink href="/group/list" prefixGroup={true}>
          <Link w="full">
            {t("header:menu_primary.groups.see_all")} <LuArrowRight />
          </Link>
        </LocalLink>
      </MenuItem>

      {filterGroups?.map((g) => {
        const groupURL: any = removePrefix
          ? g?.webAddress?.replace(SITE_CONFIG.SITE.URL, "")
          : g?.webAddress;

        return (
          <MenuItem key={g.id} minH="3rem" value={g.id}>
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
    </MenuContent>
  );
};

export default GroupListItem;
