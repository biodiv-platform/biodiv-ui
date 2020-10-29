import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Stack,
  Text
} from "@chakra-ui/core";
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
import PeopleIcon from "@icons/people";
import { axFlagDocument, axUnFlagDocument } from "@services/document.service";
import { formatDateReadable } from "@utils/date";
import { getUserImage } from "@utils/media";
import React from "react";

export default function InfoTab({ document, habitatIds, specieIds, flags }) {
  const { t } = useTranslation();
  const { habitats, species } = useDocumentFilter();
  const { user, currentGroup } = useGlobalState();

  return (
    <Box
      color="gray.600"
      boxSize="full"
      display="flex"
      flexDir="column"
      justifyContent="space-between"
    >
      <Stack ml={4}>
        <LocalLink href={`/document/show/${document.id}`}>
          <a>
            <Heading size="sm" title={document?.title}>
              <Flex justifyContent="flex-start" alignItems="center">
                <Image boxSize="3rem" src="/next-assets/document.svg" />
                <Text m={2}>
                  {document?.title || t("OBSERVATION.UNKNOWN")}
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
                </Text>
              </Flex>
            </Heading>
          </a>
        </LocalLink>
        <Flex justifyContent="flex-start">
          {document?.author && (
            <Text mr={2} title="Author">
              <PeopleIcon mb={1} mr={2} /> {document.author}
            </Text>
          )}

          {document.created_on && (
            <Text title="Date">
              <CalendarIcon mb={1} mr={2} />
              {formatDateReadable(document.created_on)}
            </Text>
          )}
        </Flex>
        {document?.notes && (
          <Box>
            <Text title="Abstract">
              {document?.notes?.replace(/<[^>]*>?/gm, "").substring(0, 200)}
            </Text>
          </Box>
        )}
      </Stack>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <SimpleGrid columns={[1, 2, 2]}>
          <Link href={`${currentGroup?.webAddress}/user/show/${user?.id}`}>
            <Flex alignItems="flex-end">
              <Avatar
                mr={2}
                flexShrink={0}
                size="sm"
                name={user?.name}
                src={getUserImage(user?.profilePic)}
              />
              <Text>{user?.name}</Text>
            </Flex>
          </Link>
          {document.publisher && (
            <Text title="Publisher">
              <LockIcon mb={1} m={3} />
              {document.publisher}
            </Text>
          )}
        </SimpleGrid>

        <Flex>
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
        </Flex>
      </Flex>
    </Box>
  );
}
