import { Badge, Box, Flex, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import useGlobalState from "@hooks/use-global-state";
import CalendarIcon from "@icons/calendar";
import MapIcon from "@icons/map";
import MessageIcon from "@icons/message";
import PawIcon from "@icons/paw";
import { DATE_ACCURACY } from "@static/constants";
import { formatDateReadableFromUTC } from "@utils/date";
import { getUserImage } from "@utils/media";
import { getInjectableHTML } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Avatar } from "@/components/ui/avatar";

import useDataTableList from "../../common/use-datatable-filter";

interface InfoTabInterface {
  datatable;
  user?;
  specieIds?;
}

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

export default function InfoTab({ datatable }: InfoTabInterface) {
  const { t } = useTranslation();
  const { species } = useDataTableList();
  const { currentGroup } = useGlobalState();

  return (
    <Flex
      className="white-box fade view_list"
      direction={["column", "column", "row", "row"]}
      justify="space-between"
      mb={4}
      overflow="hidden"
    >
      <Box p={4} w="full">
        {/* Title + Flag */}
        <Flex justifyContent="space-between" mb={2}>
          <LocalLink href={`/datatable/show/${datatable.id}`} prefixGroup={true}>
              <HStack alignItems="center" gap={4}>
                <Heading
                  fontSize="lg"
                  className="elipsis-2"
                  dangerouslySetInnerHTML={{
                    __html: getInjectableHTML(datatable?.title || t("common:unknown"))
                  }}
                />
                <Badge colorPalette="red">{datatable.dataTableType}</Badge>
              </HStack>
          </LocalLink>
        </Flex>

        {/* Meta Data */}
        <Stack color="gray.600">
          <MetaBlock
            icon={<MapIcon size={"sm"} />}
            tooltip={t("datatable:location")}
            children={datatable?.geographicalCoveragePlaceName}
          />

          <MetaBlock
            icon={<CalendarIcon size={"sm"} />}
            tooltip={t("common:observed_on")}
            children={
              datatable?.temporalCoverageDateAccuracy === DATE_ACCURACY.UNKNOWN ? (
                <Text>{t("common:unknown")}</Text>
              ) : (
                formatDateReadableFromUTC(datatable?.temporalCoverageFromDate)
              )
            }
          />

          <MetaBlock
            icon={<MessageIcon size={"sm"} />}
            tooltip={t("form:description.title")}
            isHtml={true}
            children={datatable?.summary}
          />
          <Flex alignItems="flex-end" justifyContent="space-between">
            <Stack>
              <MetaBlock
                icon={<PawIcon size={"sm"} />}
                tooltip={t("form:coverage.title")}
                children={
                  datatable?.taxonomicCoverageGroupIds ? (
                    <SpeciesGroupBox
                      id={parseInt(datatable?.taxonomicCoverageGroupIds)}
                      canEdit={false}
                      speciesGroups={species}
                      observationId={datatable?.id}
                    />
                  ) : null
                }
              />
            </Stack>
            <Link href={`${currentGroup?.webAddress}/user/show/${datatable?.user?.id}`}>
              <Flex alignItems="center">
                <Avatar
                  mr={1}
                  size="sm"
                  name={datatable?.user?.name}
                  src={getUserImage(datatable?.user?.profilePic, datatable?.user?.name)}
                />
                <Text>{datatable?.user?.name}</Text>
              </Flex>
            </Link>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
}
