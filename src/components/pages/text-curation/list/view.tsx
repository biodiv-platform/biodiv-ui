import { Avatar, AvatarGroup, Box, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import MessageIcon from "@icons/message";
import PeopleIcon from "@icons/people";
import { getUserImage } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface MetaBlockProps {
  icon?;
  children?;
  isHtml?: boolean;
  tooltip?;
}

const MetaBlock = ({ icon, children, isHtml, tooltip }: MetaBlockProps) =>
  children ? (
    <HStack alignItems="center" spacing={2} title={tooltip}>
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

export default function View({ d }) {
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
        {/* Title */}
        <Flex justifyContent="space-between" mb={2}>
          <LocalLink href={`/text-curation/show/${d.id}`} prefixGroup={true}>
            <a>
              <HStack alignItems="center" spacing={4}>
                <Heading
                  fontSize="lg"
                  className="elipsis-2"
                  dangerouslySetInnerHTML={{
                    __html: getInjectableHTML(d?.title || t("common:unknown"))
                  }}
                />
              </HStack>
            </a>
          </LocalLink>
        </Flex>

        {/* Meta Data */}
        <Stack color="gray.600">
          <MetaBlock
            icon={<MessageIcon />}
            tooltip={t("form:description.title")}
            isHtml={true}
            children={d?.description}
          />
          <Flex alignItems="flex-end" justifyContent="space-between">
            <MetaBlock
              icon={<PeopleIcon />}
              tooltip="Contributors"
              isHtml={true}
              children="Contributors"
            />
            <AvatarGroup size="sm" max={10}>
              {d.contributors?.map((u) => (
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
              icon={<PeopleIcon />}
              tooltip="Validators"
              isHtml={true}
              children="Validators"
            />
            <AvatarGroup size="sm" max={10}>
              {d.validators?.map((u) => (
                <Avatar
                  key={u.id}
                  name={u.name}
                  src={getUserImage(u.profilePic, u.name)}
                  title={u.name}
                />
              ))}
            </AvatarGroup>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
}
