import { Box, Flex, Select, Stack, Text } from "@chakra-ui/react";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpeciesList from "./use-species-list";

const sortByOptions = [
  {
    name: "common:list.sort_options.latest",
    key: "species.dateCreated"
  },
  {
    name: "common:list.sort_options.last_updated",
    key: "species.lastUpdated"
  }
];

export default function ListHeader() {
  const { filter, setFilter, speciesData } = useSpeciesList();
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
        <Stack isInline={true} spacing={4} mb={4}>
          <Box>
            <Select
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
            </Select>
          </Box>
        </Stack>
        <Text color="gray.600" mb={4}>
          {format(speciesData?.n || 0)} {t("species:list.title")}
        </Text>
      </Flex>
    </>
  );
}
