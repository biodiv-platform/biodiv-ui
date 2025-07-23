import { Box, Button, Skeleton, Table } from "@chakra-ui/react";
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
        <Table.Root striped colorPalette="gray" size="sm">
          <Table.Header>
            <Table.Row>
              {group && speciesGroups && (
                <Table.ColumnHeader {...stickyTh}>{t("observation:group")}</Table.ColumnHeader>
              )}
              <Table.ColumnHeader {...stickyTh}>
                {t("observation:list.life_list.species_header")}
              </Table.ColumnHeader>

              {/* isNumeric={true} */}
              <Table.ColumnHeader {...stickyTh}>
                {t("observation:list.life_list.count_header")}
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.list.map(([specieName, specieCount]) => (
              <Table.Row key={specieName} className="fade">
                {group && speciesGroups && (
                  <Table.Cell>
                    <SpeciesGroupBox
                      id={parseInt(group)}
                      canEdit={false}
                      speciesGroups={speciesGroups}
                      observationId={group}
                    />
                  </Table.Cell>
                )}
                <Table.Cell>
                  <i>{specieName}</i>
                </Table.Cell>
                <Table.Cell>
                  {specieCount && (
                    <ExternalBlueLink asChild>
                      <LocalLink
                        href="/observation/list"
                        params={{ ...filter, view: "list", recoName: specieName }}
                        prefixGroup={true}
                      >
                        {specieCount}
                      </LocalLink>
                    </ExternalBlueLink>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
      <Button
        w="full"
        onClick={loadMoreUniqueSpecies}
        loading={data.isLoading}
        borderTopRadius={0}
        variant={"surface"}
      >
        {t("common:load_more")}
      </Button>
    </Box>
  ) : data.isLoading ? (
    <Skeleton h={450} borderRadius="md" />
  ) : null;
}
