import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { sortByOptions } from "@static/user";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";

import useUserList from "../../../common/use-user-filter";
import BulkMapperHeader from "../bulk-mapper/header";

export default function ListHeader() {
  const {
    filter,
    setFilter,
    userListData,
    bulkUserIds,
    handleBulkCheckbox,
    onOpen: openBulkMappingModal
  } = useUserList();
  const { t } = useTranslation();

  const handleOnSort = (e) => {
    const v = e?.target?.value;
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.sort = `${v}`;
    });
  };

  return (
    <>
      <Flex
        mt={4}
        direction={{ base: "column", md: "row-reverse" }}
        alignItems="center"
        justify="space-between"
      >
        <Stack direction={"row"} gap={4} mb={4}>
          <BulkMapperHeader
            bulkIds={bulkUserIds}
            handleBulkCheckbox={handleBulkCheckbox}
            openBulkMappingModal={openBulkMappingModal}
          />
          <Box>
            <NativeSelectRoot>
              <NativeSelectField
                maxW="10rem"
                aria-label={t("common:list.sort_by")}
                value={filter?.sort}
                onChange={handleOnSort}
              >
                {sortByOptions.map(({ name, key }) => (
                  <option key={key} value={key}>
                    {t(name)}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
        </Stack>
        <Text color="gray.600" mb={4}>
          {format(userListData?.n || 0)} {t("user:user_found")}
        </Text>
      </Flex>
    </>
  );
}
