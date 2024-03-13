import {
  Box,
  Button,
  Flex,
  HStack,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import BulkMapperHeader from "@components/pages/common/bulk-mapper";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import DownloadIcon from "@icons/download";
import { sortByOptions, viewTabs } from "@static/observation-list";
import { waitForAuth } from "@utils/auth";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense } from "react";

const DownloadObservationDataModal = React.lazy(() => import("../download-observation-modal"));

export default function ListHeader() {
  const {
    filter,
    setFilter,
    onOpen: openBulkMappingModal,
    observationData,
    handleBulkCheckbox,
    bulkObservationIds,
    selectAll,
    allMedia,
    setAllMedia,
    addMediaToggle
  } = useObservationFilter();
  const defaultIndex = viewTabs.findIndex((tab) => tab.key === filter?.view);
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOnViewChange = (index: number) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.view = viewTabs[index].key;
    });
  };

  const handleOnSort = (e) => {
    const v = e?.target?.value;
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.sort = `${v}`;
    });
  };

  const onListDownload = async () => {
    await waitForAuth();
    onOpen();
  };

  const handleSelectAll = () => {
    alert(`${observationData.n} ${t("observation:select_all_message")}`);
    handleBulkCheckbox("selectAll");
  };

  const handleMediaToggle = (e) => {
    setAllMedia(e.target.checked);
    addMediaToggle(e);
  };

  return (
    <>
      <Flex mt={4} direction={{ base: "column", md: "row" }} justify="space-between">
        <Tabs
          display="inline-block"
          className="icon-tabs"
          onChange={handleOnViewChange}
          variant="soft-rounded"
          isManual={true}
          defaultIndex={defaultIndex}
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
          <Button
            variant="outline"
            colorScheme="blue"
            leftIcon={<DownloadIcon />}
            onClick={onListDownload}
          >
            {t("observation:download.title")}
          </Button>
        </Stack>
      </Flex>

      <HStack spacing={4}>
        <Text>With media</Text>
        <Switch defaultChecked={allMedia} id="media-toggle" onChange={handleMediaToggle} />
        <Text>All</Text>
      </HStack>

      {observationData && observationData.n > -1 && (
        <Flex mb={4} justifyContent="space-between" minH="32px" alignItems="center">
          <Text color="gray.600">
            {format(observationData.n)} {t("observation:list.observations_found")}
          </Text>
          <BulkMapperHeader
            selectAll={selectAll}
            bulkIds={bulkObservationIds}
            handleSelectAll={handleSelectAll}
            handleBulkCheckbox={handleBulkCheckbox}
            openBulkMappingModal={openBulkMappingModal}
          />
        </Flex>
      )}

      {isOpen && (
        <Suspense fallback={null}>
          <DownloadObservationDataModal isOpen={isOpen} onClose={onClose} />
        </Suspense>
      )}
    </>
  );
}
