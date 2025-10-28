import { Box, Button, Skeleton } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import ScientificName from "@components/@core/scientific-name";
import styled from "@emotion/styled";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const Table = styled.table`
  tr {
    border-bottom: 1px solid var(--chakra-colors-gray-300);
  }
  td:first-of-type {
    border-left: 0;
  }
`;

const LifeListTable = ({ data, loadMore, title, extraParams }) => {
  const { t } = useTranslation();

  return data.list.length > 0 ? (
    <Box className="white-box">
      <BoxHeading p={2} fontSize="md">
        {title} ({data.total})
      </BoxHeading>
      <Box w="full" overflowY="auto" h={370}>
        <Table className="table">
          <tbody>
            {data.list.map((o) => (
              <tr key={`${o.speciesId}-${o.maxVotedRecoId}-${o.taxonId}`} className="fade">
                <td>
                  {o.speciesId ? (
                    <ExternalBlueLink href={`/species/show/${o.speciesId}`}>
                      <ScientificName value={o.name} />
                    </ExternalBlueLink>
                  ) : (
                    <ScientificName value={o.name} />
                  )}
                </td>
                <td>
                  <ExternalBlueLink href={`/observation/list?${extraParams(o)}`}>
                    {o.freq}
                  </ExternalBlueLink>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>

      <Button
        w="full"
        onClick={loadMore}
        loading={data.isLoading}
        borderTopRadius={0}
        variant={"subtle"}
      >
        {t("common:load_more")}
      </Button>
    </Box>
  ) : data.isLoading ? (
    <Skeleton h={450} borderRadius="md" />
  ) : (
    <div>No Data</div>
  );
};

export default LifeListTable;
