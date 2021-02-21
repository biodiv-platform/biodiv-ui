import {
  Avatar,
  Box,
  Button,
  HStack,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import { getUserImage } from "@utils/media";
import React from "react";

export default function IdentifiersTable({ data, title, loadMoreIdentifiers, filter }) {
  const { t } = useTranslation();

  const { user: _user, ...queryParams } = filter;

  return data.list.length > 0 ? (
    <Box className="white-box">
      <BoxHeading>{title}</BoxHeading>

      <Box w="full" overflowY="auto" h={490}>
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th
                textTransform="capitalize"
                textColor="black"
                fontSize="md"
                backgroundColor="#ededed"
              >
                {t("LIST.TOP_IDENTIFIERS_LIST.AUTHOR_HEADER")}
              </Th>
              <Th
                textTransform="capitalize"
                textColor="black"
                fontSize="md"
                backgroundColor="#ededed"
              >
                {t("LIST.TOP_IDENTIFIERS_LIST.COUNT_HEADER")}
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {data.list.map(({ name, pic, authorId, count }) => (
              <Tr key={`${authorId}-${count}`}>
                <Td>
                  <HStack p="md">
                    <Avatar position="relative" src={getUserImage(pic, 50)} name={name} />
                    <LocalLink href={`/user/show/${authorId}/`} prefixGroup={true}>
                      <ExternalBlueLink>{name}</ExternalBlueLink>
                    </LocalLink>
                  </HStack>
                </Td>

                <Td>
                  {count != 0 ? (
                    <LocalLink
                      href={`/observation/list`}
                      params={{ ...queryParams, view: "list", authorVoted: authorId }}
                      prefixGroup={true}
                    >
                      <ExternalBlueLink>{count}</ExternalBlueLink>
                    </LocalLink>
                  ) : (
                    count
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Button w="full" onClick={loadMoreIdentifiers} isLoading={data.isLoading} borderTopRadius={0}>
        {t("LOAD_MORE")}
      </Button>
    </Box>
  ) : data.isLoading ? (
    <Skeleton h={450} borderRadius="md" />
  ) : (
    <div>No Data</div>
  );
}
