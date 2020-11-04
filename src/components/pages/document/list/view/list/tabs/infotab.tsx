import { Avatar, Badge, Box, Flex, Heading, Image, Link, Stack, Text } from "@chakra-ui/core";
import FlagActionButton from "@components/@core/action-buttons/flag";
import LocalLink from "@components/@core/local-link";
import FilterIconsList from "@components/pages/document/common/filter-list-icon";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import CalendarIcon from "@icons/calendar";
import Grid from "@icons/grid";
import LocationIcon from "@icons/location";
import LockIcon from "@icons/lock";
import Feedback from "@icons/feedback";
import PeopleIcon from "@icons/people";
import { axFlagDocument, axUnFlagDocument } from "@services/document.service";
import { getUserImage } from "@utils/media";
import React from "react";

export default function InfoTab({ document, habitatIds, specieIds, flags, user }) {
  const { t } = useTranslation();
  const { habitats, species } = useDocumentFilter();
  const { currentGroup } = useGlobalState();

  return (
    <Stack
      color="gray.600"
      boxSize="full"
      display="flex"
      flexDir="column"
      justifyContent="space-evenly"
    >
      <LocalLink href={`/document/show/${document.id}`}>
        <a>
          <Heading size="sm" title={document?.title}>
            <Flex justifyContent="flex-start" alignItems="center">
              <Image boxSize="3rem" src="/next-assets/document.svg" />
              <Text isTruncated maxWidth="700px" m={2}>
                {document?.title || t("OBSERVATION.UNKNOWN")}
              </Text>
              <Badge ml={2} colorScheme="red">
                {document.item_type}
              </Badge>
              <FlagActionButton
                resourceId={document.id}
                resourceType="document"
                initialFlags={flags}
                userId={user.id}
                flagFunc={axFlagDocument}
                unFlagFunc={axUnFlagDocument}
              />
            </Flex>
          </Heading>
        </a>
      </LocalLink>
      <Stack>
        <Stack ml={2} justifyContent="center">
          {document?.author && (
            <Text isTruncated maxWidth="600px" title="Author">
              <PeopleIcon mb={1} mr={3} /> {document.author}
            </Text>
          )}
          <Stack isInline>
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

          {document?.notes && (
            <Stack isInline alignItems="baseline">
              <Text title="Abstract">
                <Feedback mb={1} mr={2} />
              </Text>
              <Box>
                {document?.notes?.replace(/<[^>]*(>|$)|&nbsp;|&gt;/g, "").substring(0, 250)}
              </Box>
            </Stack>
          )}
        </Stack>

        <Flex justifyContent="space-between" alignItems="center">
          <Stack isInline spacing={5} align="center">
            {habitatIds[0] !== null && habitats && (
              <FilterIconsList
                title={t("GROUP.HABITATS_COVERED")}
                type="habitat"
                icon={<Grid />}
                filterIds={habitatIds}
                filterList={habitats}
              />
            )}
            {habitatIds[0] !== null && species && (
              <FilterIconsList
                title={t("GROUP.SPECIES_COVERAGE")}
                type="species"
                icon={<LocationIcon />}
                filterIds={specieIds}
                filterList={species}
              />
            )}
          </Stack>
          <Stack isInline mr={4} spacing={5} align="center">
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
        </Flex>
      </Stack>
    </Stack>
  );
}
