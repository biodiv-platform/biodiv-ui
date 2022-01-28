import { Box, Flex, Select, Stack, Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { sortByOptions } from "@static/datatable";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useDataTableList from "../../common/use-datatable-filter";

export default function Header() {
  const { filter, setFilter, dataTableData } = useDataTableList();
  const { t } = useTranslation();

  const handleOnSort = (e) => {
    const v = e?.target?.value;
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.sortOn = `${v}`;
    });
  };

  return (
    <>
      <PageHeading>📚 {t("datatable:list.title")}</PageHeading>
      <Flex
        mt={4}
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        justify="space-between"
      >
        {dataTableData && (
          <Text color="gray.600" mb={2}>
            {format(dataTableData.n)} {t("datatable:found")}
          </Text>
        )}
        {dataTableData.n > 0 && <Stack isInline={true} spacing={4} mb={4}>
          <Box>
            <Select
              maxW="10rem"
              aria-label={t("common:list.sort_by")}
              value={filter?.sortOn}
              onChange={handleOnSort}
            >
              {sortByOptions.map(({ name, key }) => (
                <option key={key} value={key}>
                  {t(name)}
                </option>
              ))}
            </Select>
          </Box>
        </Stack>}
      </Flex>
    </>
  );
}
