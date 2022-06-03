import { Avatar, Badge, Box, Flex, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import DocumentIcon from "@components/pages/document/common/document-icon";
import useGlobalState from "@hooks/use-global-state";
import CalendarIcon from "@icons/calendar";
import LockIcon from "@icons/lock";
import PeopleIcon from "@icons/people";
import { getUserImage } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface InfoTabInterface {
  document;
  user;
  habitatIds?;
  specieIds?;
  flags?;
}
export default function InfoTab({ document, user }: InfoTabInterface) {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();

  return (
    <Stack color="gray.600" display="flex" flexDir="column" justifyContent="flex-start" bg="white">
      <Box p={3} borderWidth="1px" borderColor="gray.300" borderRadius="md">
        <LocalLink href={`/document/show/${document.id}`}>
          <a>
            <HStack alignItems="center" spacing={4}>
              <DocumentIcon />
              <Heading fontSize="lg" className="elipsis-2">
                <span
                  dangerouslySetInnerHTML={{
                    __html: getInjectableHTML(document?.title || t("document:unknown"))
                  }}
                />
              </Heading>
              <Badge colorScheme="red">{document.itemtype}</Badge>
            </HStack>
          </a>
        </LocalLink>

        <Stack isInline justifyContent="space-between" alignItems="flex-end">
          <Stack isInline justify="space-between" alignItems="flex-end">
            {document?.author && (
              <Text noOfLines={1} maxWidth={{ base: "30vh", sm: "40vh", md: "120vh" }} title="Author">
                <PeopleIcon mr={2} />
                {document.author}
              </Text>
            )}
            {document.year && (
              <Text title="Date">
                <CalendarIcon mr={2} />
                {document.year}
              </Text>
            )}
            {document.journal && (
              <Text title="journal">
                <LockIcon mr={2} />
                <span
                  dangerouslySetInnerHTML={{
                    __html: getInjectableHTML(document.journal)
                  }}
                />
              </Text>
            )}
          </Stack>
          <Link href={`${currentGroup?.webAddress}/user/show/${user?.id}`}>
            <Flex alignItems="center">
              <Avatar
                mr={1}
                flexShrink={0}
                size="sm"
                name={user?.name}
                src={getUserImage(user?.profilePic, user?.name)}
              />
              <Text>{user?.name}</Text>
            </Flex>
          </Link>
        </Stack>
      </Box>
    </Stack>
  );
}
