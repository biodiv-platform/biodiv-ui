import React from "react";
import { Box, Heading, Text, Link, Avatar, Flex, Badge, Stack } from "@chakra-ui/core";
import FilterIconsList from "@components/pages/document/common/filter-list-icon";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import useTranslation from "@hooks/use-translation";
import PeopleIcon from "@icons/people";
import Grid from "@icons/grid";
import FeedBackIcon from "@icons/feedback";
import FlagActionButton from "@components/@core/action-buttons/flag";
import { axFlagDocument, axUnFlagDocument } from "@services/document.service";

import useGlobalState from "@hooks/use-global-state";
import { getUserImage } from "@utils/media";
import PDFIcon from "@icons/pdf";

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
        <Heading size="md" title={document?.title}>
          <Flex justifyContent="flex-start" alignItems="center">
            <PDFIcon m={2} width="2em" height="2em" color="red.500" />
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
        {document?.notes && (
          <Box>
            <Text title="Abstract">
              {document?.notes?.replace(/<[^>]*>?/gm, "").substring(0, 200)}
            </Text>
          </Box>
        )}
        {document?.attribution && (
          <Box>
            <Text title="Attribution">
              <FeedBackIcon /> {document.attribution.substring(0, 140)}
            </Text>
          </Box>
        )}
      </Stack>
      <Flex justifyContent="space-between" m={4} alignItems="center">
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
              icon={<PeopleIcon />}
              filterIds={specieIds}
              filterList={species}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
