import { Avatar, Badge, Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import DocumentIcon from "@components/pages/document/common/document-icon";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import CalendarIcon from "@icons/calendar";
import LockIcon from "@icons/lock";
import PeopleIcon from "@icons/people";
import { getUserImage } from "@utils/media";
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
    <Stack color="gray.600" display="flex" flexDir="column" justifyContent="flex-start">
      <Box p={2} borderWidth="2px">
        <LocalLink href={`/document/show/${document.id}`}>
          <a>
            <Heading size="sm" title={document?.title}>
              <Flex justifyContent="space-between">
                <Flex alignItems="center">
                  <DocumentIcon />
                  <Text isTruncated maxWidth={["30vh", "30vh", "40vh", "120vh"]} m={2}>
                    {document?.title || t("OBSERVATION.UNKNOWN")}
                  </Text>
                  <Badge ml={2} colorScheme="red">
                    {document.item_type}
                  </Badge>
                </Flex>
              </Flex>
            </Heading>
          </a>
        </LocalLink>

        <Stack ml={2} justifyContent="center">
          {document?.author && (
            <Text isTruncated maxWidth={["30vh", "30vh", "40vh", "40vh"]} title="Author">
              <PeopleIcon mb={1} mr={3} /> {document.author}
            </Text>
          )}
          <Stack isInline justify="space-between" align="center">
            <Stack align="center" isInline>
              {document.year && (
                <Text title="Date">
                  <CalendarIcon mb={1} mr={4} />
                  {document.year}
                </Text>
              )}
              {document.journal && (
                <Text title="journal">
                  <LockIcon m={2} />
                  {document.journal}
                </Text>
              )}
            </Stack>
            <Link href={`${currentGroup?.webAddress}/user/show/${user?.id}`}>
              <Flex alignItems="center">
                <Avatar
                  m={1}
                  flexShrink={0}
                  size="sm"
                  name={user?.name}
                  src={getUserImage(user?.profilePic)}
                />
                <Text>{user?.name}</Text>
              </Flex>
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
