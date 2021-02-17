import { Box, Button, Skeleton } from '@chakra-ui/react';
import ExternalBlueLink from '@components/@core/blue-link/external';
import BoxHeading from '@components/@core/layout/box-heading';
import LocalLink from '@components/@core/local-link';
import styled from '@emotion/styled';
import useTranslation from '@hooks/use-translation';
import React from 'react';

const Table = styled.table`
  tr {
    border-bottom: 1px solid var(--gray-300);
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    border-top: 0;
    background: #ededed;
    text-align: left;
  }
`;

export default function LifeListTable({ data, title, loadMoreUniqueSpecies, filter }) {
  const { t } = useTranslation();

  const { recoName: _recoName,...queryParams } = filter;

  return data.list.length > 0 ? (
    <Box className="white-box">
      <BoxHeading>{title}</BoxHeading>

      <Box w="full" overflowY="auto" h={400}>
        <Table className="table">
          <tbody>
            <tr>
              <th>{t("LIST.LIFE_LIST.SPECIES_HEADER")}</th>
              <th>{t("LIST.LIFE_LIST.COUNT_HEADER")}</th>
            </tr>
            {data.list.map(([specieName, specieCount]) => (
              <tr key={`${specieName}`} className="fade">
                <td>{specieName}</td>

                <LocalLink
                  href={`/observation/list`}
                  params={{ ...queryParams, view: "list", recoName: specieName }}
                  prefixGroup={true}
                >
                  <ExternalBlueLink>
                    <td>{specieCount}</td>
                  </ExternalBlueLink>
                </LocalLink>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
      <Button
        w="full"
        onClick={loadMoreUniqueSpecies}
        isLoading={data.isLoading}
        borderTopRadius={0}
      >
        {t("LOAD_MORE")}
      </Button>
    </Box>
  ) : data.isLoading ? (
    <Skeleton h={450} borderRadius="md" />
  ) : (
    <div>No Data</div>
  );
}
