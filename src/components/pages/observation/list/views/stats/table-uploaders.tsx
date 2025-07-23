import { Box, Button, HStack, Skeleton, Table } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Avatar } from "@/components/ui/avatar";

import { stickyTh } from "./common";

export default function UploadersTable({ data, title, loadMoreUploaders, filter }) {
  const { t } = useTranslation();

  return data?.list?.length > 0 ? (
    <Box className="white-box">
      <BoxHeading>⭐ {title}</BoxHeading>
      <Box w="full" overflowY="auto" h={360}>
        <Table.Root striped colorPalette="gray" size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader {...stickyTh}>
                {t("observation:list.top_uploaders_list.author_header")}
              </Table.ColumnHeader>
              <Table.ColumnHeader {...stickyTh}>
                {t("observation:list.top_uploaders_list.count_header")}
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.list.map(({ name, pic, authorId, count }) => (
              <Table.Row key={`${authorId}-${count}`}>
                <Table.Cell>
                  <HStack>
                    <Avatar size="xs" src={getUserImage(pic, name, 24)} name={name} />
                    <ExternalBlueLink asChild>
                      <LocalLink href={`/user/show/${authorId}/`} prefixGroup={true}>
                        {name}
                      </LocalLink>
                    </ExternalBlueLink>
                  </HStack>
                </Table.Cell>

                <Table.Cell>
                  {count && (
                    <ExternalBlueLink asChild>
                      <LocalLink
                        href="/observation/list"
                        params={{ ...filter, view: "list", user: authorId }}
                        prefixGroup={true}
                      >
                        {count}
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
        onClick={loadMoreUploaders}
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
