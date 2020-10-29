import { Box, Button, Skeleton } from "@chakra-ui/core";
import ExternalBlueLink from "@components/@core/blue-link/external";
import styled from "@emotion/styled";
import useTranslation from "@hooks/use-translation";
import React from "react";

const Table = styled.table`
  tr {
    border-top: 1px solid var(--gray-300);
  }
  td:first-of-type {
    border-left: 0;
  }
`;

const LifeListTable = ({ data, loadMore, title, extraParams }) => {
  const { t } = useTranslation();

  return data.list.length > 0 ? (
    <Box border="1px solid" borderColor="gray.300" borderRadius="md">
      <Box fontWeight="bold" p={2} bg="gray.100">
        {title} ({data.total})
      </Box>

      <Box w="full" overflowY="auto" h={370}>
        <Table className="table">
          <tbody>
            {data.list.map((o) => (
              <tr key={`${o.speciesId}-${o.maxVotedRecoId}-${o.taxonId}`} className="fade">
                <td>
                  <ExternalBlueLink href={`/species/show/${o.speciesId}`}>
                    {o.name}
                  </ExternalBlueLink>
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

      <Button w="full" onClick={loadMore} isLoading={data.isLoading} borderTopRadius={0}>
        {t("LOAD_MORE")}
      </Button>
    </Box>
  ) : data.isLoading ? (
    <Skeleton h={450} borderRadius="md" />
  ) : (
    <div>No Data</div>
  );
};

export default LifeListTable;
