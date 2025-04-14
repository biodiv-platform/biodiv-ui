import { Box, Flex, Stack, Tabs, Text } from "@chakra-ui/react";
import BulkMapperHeader from "@components/pages/common/bulk-mapper";
import GridIcon from "@icons/grid";
import ListIcon from "@icons/list";
import { sortByOptions } from "@static/species";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";

import useSpeciesList from "./use-species-list";

export const viewTabs = [
  {
    name: "common:list.view_type.grid",
    icon: <GridIcon size={"sm"} />,
    key: "grid"
  },
  {
    name: "common:list.view_type.list",
    icon: <ListIcon size={"sm"} />,
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

  const handleOnViewChange = (value) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.view = value;
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
        <Tabs.Root
          display="inline-block"
          className="icon-tabs"
          onValueChange={(e) => handleOnViewChange(e.value)}
          activationMode="manual"
          defaultValue={viewTabs[0].key}
          mb={4}
          lazyMount
        >
          <Tabs.List aria-orientation="vertical">
            {viewTabs.map(({ name, icon, key }) => (
              <Tabs.Trigger
                value={key}
                key={key}
                aria-label={t(name)}
                aria-controls={`view_${key}`}
              >
                {icon} {t(name)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        <Stack direction={"row"} alignItems="baseline" gap={4} mb={4}>
          <Text color="gray.600" mb={4}>
            {format(speciesData?.n || 0)} {t("species:list.title")}
          </Text>
          <Box>
            <NativeSelectRoot
              maxW="10rem"
              aria-label={t("common:list.sort_by")}
              defaultValue={filter?.sort}
              onChange={handleOnSort}
            >
              <NativeSelectField>
                {sortByOptions.map(({ name, key }) => (
                  <option key={key} value={key}>
                    {t(name)}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
        </Stack>
      </Flex>
      <Stack mb={4} direction={"row"} justifyContent="flex-end">
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
