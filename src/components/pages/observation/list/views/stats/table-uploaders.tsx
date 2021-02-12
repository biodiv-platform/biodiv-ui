import { Box, Button, Skeleton, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@hooks/use-translation";
import React from "react";
import { getUserImage } from "@utils/media";

import { Avatar, HStack } from "@chakra-ui/react";

import { stringify } from "querystring";

export default function UploadersTable({ data, title, loadMoreUniqueSpecies, filter }) {
  const { t } = useTranslation();

  const queryParams = { ...filter };
  if (filter.user) {
    delete queryParams["user"];
  }
  queryParams.view = "list";
  const address = stringify(queryParams);

  return data.list.length > 0 ? (
    <Box className="white-box">
      <BoxHeading>{title}</BoxHeading>

      <Box w="full" overflowY="auto" h={370}>
        <Table variant="striped" colorScheme="blackAlpha">
          <Thead>
            <Tr>
              <Th>{t("LIST.TOP_UPLOADERS_LIST.AUTHOR_HEADER")}</Th>
              <Th>{t("LIST.TOP_UPLOADERS_LIST.COUNT_HEADER")}</Th>
            </Tr>
          </Thead>

          <Tbody>
            {data.list.map(({ name, pic, authorId, count }) => (
              <Tr key={`${authorId}-${count}`}>
                <Td>
                  <HStack spacing="10px">
                    <Avatar position="relative" src={getUserImage(pic, 50)} name={name} />
                    <ExternalBlueLink
                      href={
                        filter?.groupName
                          ? `/group/${filter.groupName}/user/show/${authorId}`
                          : `/user/show/${authorId}`
                      }
                    >
                      {name}
                    </ExternalBlueLink>
                  </HStack>
                </Td>

                <Td>
                  <ExternalBlueLink
                    href={
                      filter?.groupName
                        ? `/group/${filter?.groupName}/observation/list?${address}&user=${authorId}`
                        : `/observation/list?${address}&user=${authorId}`
                    }
                  >
                    {count}
                  </ExternalBlueLink>
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
        {t("LOAD_MORE")}
      </Button>
    </Box>
  ) : data.isLoading ? (
    <Skeleton h={450} borderRadius="md" />
  ) : (
    <div>No Data</div>
  );
}
