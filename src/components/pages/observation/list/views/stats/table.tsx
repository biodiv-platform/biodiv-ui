import { Box, Button, Skeleton, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { stickyTh } from "./common";

export default function LifeListTable({ data, title, loadMoreUniqueSpecies, filter }) {
  const { t } = useTranslation();

  return data.list.length > 0 ? (
    <Box className="white-box">
      <BoxHeading>🔍 {title}</BoxHeading>

      <Box w="full" overflowY="auto" h={360}>
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th {...stickyTh}>{t("observation:list.life_list.species_header")}</Th>
              <Th {...stickyTh} isNumeric={true}>
                {t("observation:list.life_list.count_header")}
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {data.list.map(([specieName, specieCount]) => (
              <Tr key={specieName} className="fade">
                <Td>{specieName}</Td>
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
