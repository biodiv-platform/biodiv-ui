import { Avatar, Badge, Box, Flex, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import FlagActionButton from "@components/@core/action-buttons/flag";
import LocalLink from "@components/@core/local-link";
import DocumentIcon from "@components/pages/document/common/document-icon";
import FilterIconsList from "@components/pages/document/common/filter-list-icon";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import useGlobalState from "@hooks/use-global-state";
import BookIcon from "@icons/bookmark";
import CalendarIcon from "@icons/calendar";
import MapIcon from "@icons/map";
import MessageIcon from "@icons/message";
import PawIcon from "@icons/paw";
import PeopleIcon from "@icons/people";
import { axFlagDocument, axUnFlagDocument } from "@services/document.service";
import { getUserImage } from "@utils/media";
import { getInjectableHTML, stripTags } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
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
    <Flex direction="column" minH="18rem" justifyContent="space-between" p={4}>
      <Stack color="gray.600">
        {/* Title + Flag */}
        <Flex justifyContent="space-between" mb={3}>
          <LocalLink href={`/document/show/${document.id}`}>
            <a>
              <HStack alignItems="center" spacing={4}>
                <DocumentIcon />
                <Heading
                  fontSize="lg"
                  className="elipsis-2"
                  dangerouslySetInnerHTML={{
                    __html: getInjectableHTML(document?.title || t("document:unknown"))
                  }}
                />
                <Badge colorPalette="red">{document.itemtype}</Badge>
              </HStack>
            </a>
          </LocalLink>
          {/* Meta Data */}
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
        <MetaBlock
          icon={<PeopleIcon />}
          tooltip={t("document:bib.author")}
          children={document?.author}
        />
        <MetaBlock
          icon={<CalendarIcon />}
          tooltip={t("document:bib.year")}
          children={document?.year}
        />
        <MetaBlock
          icon={<BookIcon />}
          tooltip={t("document:bib.journal")}
          children={stripTags(document?.journal)}
        />
        <MetaBlock
          icon={<MessageIcon />}
          tooltip={t("document:bib.abstract")}
          children={stripTags(document?.notes)}
        />
      </Stack>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Stack>
          <MetaBlock
            icon={<MapIcon />}
            tooltip={t("common:habitats_covered")}
            children={
              habitatIds[0] ? (
                <FilterIconsList type="habitat" filterIds={habitatIds} filterList={habitats} />
              ) : null
            }
          />
          <MetaBlock
            icon={<PawIcon />}
            tooltip={t("common:species_coverage")}
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
    </Flex>
  );
}
