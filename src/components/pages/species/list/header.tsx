import { Box, Flex, Select, Stack, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import BulkMapperHeader from "@components/pages/common/bulk-mapper";
import GridIcon from "@icons/grid";
import ListIcon from "@icons/list";
import { sortByOptions } from "@static/species";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpeciesList from "./use-species-list";

export const viewTabs = [
  {
    name: "common:list.view_type.grid",
    icon: <GridIcon />,
    key: "grid"
  },
  {
    name: "common:list.view_type.list",
    icon: <ListIcon />,
    key: "list"
  }
];

export default function ListHeader() {
  const { bulkSpeciesIds, speciesData, filter, setFilter, onOpen, selectAll, handleBulkCheckbox } =
    useSpeciesList();
  const { t } = useTranslation();

  const handleOnSort = (e) => {
    const v = e?.target?.value;
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.sort = `${v}`;
    });
  };

  const handleOnViewChange = (index: number) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.view = viewTabs[index].key;
    });
  };

  const handleSelectAll = () => {
    alert(`${speciesData.n} ${t("species:select_all")}`);
    handleBulkCheckbox("selectAll");
  };

  return (
    <>
      <Flex
        mt={4}
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        justify="space-between"
      >
        <Tabs
          display="inline-block"
          className="icon-tabs"
          onChange={handleOnViewChange}
          variant="soft-rounded"
          isManual={true}
          defaultIndex={viewTabs.findIndex((i) => i.key === filter.f.view)}
          mb={4}
          isLazy={true}
        >
          <TabList aria-orientation="vertical">
            {viewTabs.map(({ name, icon, key }) => (
              <Tab key={key} aria-label={t(name)} aria-controls={`view_${key}`}>
                {icon} {t(name)}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <Stack isInline={true} alignItems="baseline" spacing={4} mb={4}>
          <Text color="gray.600" mb={4}>
            {format(speciesData?.n || 0)} {t("species:list.title")}
          </Text>
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
      </Flex>
      <Stack mb={4} isInline justifyContent="flex-end">
        <BulkMapperHeader
          selectAll={selectAll}
          bulkIds={bulkSpeciesIds}
          handleSelectAll={handleSelectAll}
          handleBulkCheckbox={handleBulkCheckbox}
          openBulkMappingModal={onOpen}
        />
      </Stack>
    </>
  );
}
