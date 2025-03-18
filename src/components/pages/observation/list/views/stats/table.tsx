import { Box, Button, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { stickyTh } from "./common";
interface LifeListInterface {
  data: any;
  title?;
  group?;
  speciesGroups?;
  loadMoreUniqueSpecies;
  filter: any;
}

export default function LifeListTable({
  data,
  title,
  group,
  speciesGroups,
  loadMoreUniqueSpecies,
  filter
}: LifeListInterface) {
  const { t } = useTranslation();

  return data.list.length > 0 ? (
    <Box className="white-box">
      {title && <BoxHeading>🔍 {title}</BoxHeading>}

      <Box w="full" overflowY="auto" h={360}>
        <Table variant="striped" colorPalette="gray" size="sm">
          <Thead>
            <Tr>
              {group && speciesGroups && <Th {...stickyTh}>{t("observation:group")}</Th>}
              <Th {...stickyTh}>{t("observation:list.life_list.species_header")}</Th>
              <Th {...stickyTh} isNumeric={true}>
                {t("observation:list.life_list.count_header")}
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {data.list.map(([specieName, specieCount]) => (
              <Tr key={specieName} className="fade">
                {group && speciesGroups && (
                  <Td>
                    <SpeciesGroupBox
                      id={parseInt(group)}
                      canEdit={false}
                      speciesGroups={speciesGroups}
                      observationId={group}
                    />
                  </Td>
                )}
                <Td>
                  <i>{specieName}</i>
                </Td>
                <Td isNumeric={true}>
                  {specieCount && (
                    <LocalLink
                      href="/observation/list"
                      params={{ ...filter, view: "list", recoName: specieName }}
                      prefixGroup={true}
                    >
                      <ExternalBlueLink>{specieCount}</ExternalBlueLink>
                    </LocalLink>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Button
        w="full"
        onClick={loadMoreUniqueSpecies}
        isLoading={data.isLoading}
        borderTopRadius={0}
      >
        {t("common:load_more")}
      </Button>
    </Box>
  ) : data.isLoading ? (
    <Skeleton h={450} borderRadius="md" />
  ) : null;
}
