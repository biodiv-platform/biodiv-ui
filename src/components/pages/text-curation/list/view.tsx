import { Box, Flex, Heading, HStack, Progress, Stack, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import MessageIcon from "@icons/message";
import PeopleIcon from "@icons/people";
import { getUserImage } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Avatar, AvatarGroup } from "@/components/ui/avatar";

interface MetaBlockProps {
  icon?;
  children?;
  isHtml?: boolean;
  tooltip?;
}

const MetaBlock = ({ icon, children, isHtml, tooltip }: MetaBlockProps) =>
  children ? (
    <HStack alignItems="center" gap={2} title={tooltip}>
      {icon}
      {isHtml ? (
        <div
          className="elipsis"
          dangerouslySetInnerHTML={{ __html: getInjectableHTML(children) }}
        />
      ) : (
        <div className="elipsis" children={children} />
      )}
    </HStack>
  ) : null;

export default function View({ metadata }) {
  const { t } = useTranslation();
  return (
    <Flex
      className="white-box fade view_list"
      direction={["column", "column", "row", "row"]}
      justify="space-between"
      mb={4}
      overflow="hidden"
    >
      <Box p={4} w="full">
        <Flex justifyContent="space-between" mb={2}>
          <LocalLink href={`/text-curation/show/${metadata.id}`} prefixGroup={true}>
            <HStack alignItems="center" gap={4}>
              <Heading
                fontSize="lg"
                className="elipsis-2"
                dangerouslySetInnerHTML={{
                  __html: getInjectableHTML(metadata?.title || t("common:unknown"))
                }}
              />
            </HStack>
          </LocalLink>
        </Flex>
        <Stack color="gray.600">
          <MetaBlock
            icon={<MessageIcon size={"sm"} />}
            tooltip={t("form:description.title")}
            isHtml={true}
            children={metadata?.description}
          />
          <Flex alignItems="flex-end" justifyContent="space-between">
            <MetaBlock
              icon={<PeopleIcon size={"sm"} />}
              tooltip={t("text-curation:list_page.curators")}
              isHtml={true}
              children={t("text-curation:list_page.curators")}
            />
            {/* max={10} */}
            <AvatarGroup size="sm">
              {metadata.contributors?.map((u) => (
                <Avatar
                  key={u.id}
                  name={u.name}
                  src={getUserImage(u.profilePic, u.name)}
                  title={u.name}
                />
              ))}
            </AvatarGroup>
          </Flex>
          <Flex alignItems="flex-end" justifyContent="space-between">
            <MetaBlock
              icon={<PeopleIcon size={"sm"} />}
              tooltip={t("text-curation:list_page.verfiers")}
              isHtml={true}
              children={t("text-curation:list_page.verfiers")}
            />
            {/* max={10} */}
            <AvatarGroup size="sm">
              {metadata.validators?.map((u) => (
                <Avatar
                  key={u.id}
                  name={u.name}
                  src={getUserImage(u.profilePic, u.name)}
                  title={u.name}
                />
              ))}
            </AvatarGroup>
          </Flex>

          <HStack>
            <Progress.Root value={metadata.percentageCurated} width="sm" colorPalette="green">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Text>
              {metadata.percentageCurated}% {t("text-curation:curation_status.curated")}
            </Text>
          </HStack>
        </Stack>
      </Box>
    </Flex>
  );
}
