import { Avatar, Badge, Box, Flex, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import FlagActionButton from "@components/@core/action-buttons/flag";
import LocalLink from "@components/@core/local-link";
import DocumentIcon from "@components/pages/document/common/document-icon";
import FilterIconsList from "@components/pages/document/common/filter-list-icon";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import BookIcon from "@icons/bookmark";
import CalendarIcon from "@icons/calendar";
import MapIcon from "@icons/map";
import MessageIcon from "@icons/message";
import PawIcon from "@icons/paw";
import PeopleIcon from "@icons/people";
import { axFlagDocument, axUnFlagDocument } from "@services/document.service";
import { getUserImage } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import React from "react";

interface InfoTabInterface {
  document;
  user;
  habitatIds?;
  specieIds?;
  flags?;
}

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

export default function InfoTab({
  document,
  habitatIds,
  specieIds,
  flags,
  user
}: InfoTabInterface) {
  const { t } = useTranslation();
  const { habitats, species } = useDocumentFilter();
  const { currentGroup } = useGlobalState();

  return (
    <Box p={4}>
      {/* Title + Flag */}
      <Flex justifyContent="space-between" mb={2}>
        <LocalLink href={`/document/show/${document.id}`}>
          <a>
            <HStack alignItems="center" spacing={4}>
              <DocumentIcon />
              <Heading
                fontSize="lg"
                className="elipsis-2"
                dangerouslySetInnerHTML={{
                  __html: getInjectableHTML(document?.title || t("DOCUMENT.UNKNOWN"))
                }}
              />
              <Badge colorScheme="red">{document.itemtype}</Badge>
            </HStack>
          </a>
        </LocalLink>

        <Box>
          <FlagActionButton
            resourceId={document.id}
            resourceType="document"
            initialFlags={flags}
            userId={user.id}
            flagFunc={axFlagDocument}
            unFlagFunc={axUnFlagDocument}
          />
        </Box>
      </Flex>

      {/* Meta Data */}
      <Stack color="gray.600">
        <MetaBlock
          icon={<PeopleIcon />}
          tooltip={t("DOCUMENT.BIB.AUTHOR")}
          children={document?.author}
        />
        <MetaBlock
          icon={<CalendarIcon />}
          tooltip={t("DOCUMENT.BIB.YEAR")}
          children={document?.year}
        />
        <MetaBlock
          icon={<BookIcon />}
          tooltip={t("DOCUMENT.BIB.JOURNAL")}
          isHtml={true}
          children={document?.journal}
        />
        <MetaBlock
          icon={<MessageIcon />}
          tooltip={t("DOCUMENT.BIB.ABSTRACT")}
          isHtml={true}
          children={document?.notes}
        />
        <Flex alignItems="flex-end" justifyContent="space-between">
          <Stack>
            <MetaBlock
              icon={<MapIcon />}
              tooltip={t("GROUP.HABITATS_COVERED")}
              children={
                habitatIds[0] ? (
                  <FilterIconsList type="habitat" filterIds={habitatIds} filterList={habitats} />
                ) : null
              }
            />
            <MetaBlock
              icon={<PawIcon />}
              tooltip={t("GROUP.SPECIES_COVERAGE")}
              children={
                specieIds[0] ? (
                  <FilterIconsList type="species" filterIds={specieIds} filterList={species} />
                ) : null
              }
            />
          </Stack>
          <Link href={`${currentGroup?.webAddress}/user/show/${user?.id}`}>
            <Flex alignItems="center">
              <Avatar
                mr={1}
                size="sm"
                name={user?.name}
                src={getUserImage(user?.profilePic, user?.name)}
              />
              <Text>{user?.name}</Text>
            </Flex>
          </Link>
        </Flex>
      </Stack>
    </Box>
  );
}
