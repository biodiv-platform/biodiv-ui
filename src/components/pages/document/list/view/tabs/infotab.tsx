import { Badge, Box, Flex, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
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

import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

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
    <HStack w="full" alignItems="center" title={tooltip}>
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
  const { habitats, species, getCheckboxProps } = useDocumentFilter();
  const { currentGroup } = useGlobalState();

  return (
    <Flex direction="column" minH="18rem" justifyContent="space-between" p={4}>
      <Checkbox
          position="absolute"
          bg="white"
          m={2}
          zIndex={1}
          borderRadius={2}
          colorPalette={"blue"}
          {...getCheckboxProps({ value: document.id })}
        ></Checkbox>
      <Stack color="gray.600">
        {/* Title + Flag */}
        <Flex justifyContent="space-between" mb={3}>
          <LocalLink href={`/document/show/${document.id}`}>
            <HStack alignItems="center" gap={4}>
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
          icon={<PeopleIcon size={"sm"} />}
          tooltip={t("document:bib.author")}
          children={document?.author}
        />
        <MetaBlock
          icon={<CalendarIcon size={"sm"} />}
          tooltip={t("document:bib.year")}
          children={document?.year}
        />
        <MetaBlock
          icon={<BookIcon size={"sm"} />}
          tooltip={t("document:bib.journal")}
          children={stripTags(document?.journal)}
        />
        <MetaBlock
          icon={<MessageIcon size={"sm"} />}
          tooltip={t("document:bib.abstract")}
          children={stripTags(document?.notes)}
        />
      </Stack>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <Stack>
          <MetaBlock
            icon={<MapIcon size={"sm"} />}
            tooltip={t("common:habitats_covered")}
            children={
              habitatIds[0] ? (
                <FilterIconsList type="habitat" filterIds={habitatIds} filterList={habitats} />
              ) : null
            }
          />
          <MetaBlock
            icon={<PawIcon size={"sm"} />}
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
              size="xs"
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
