import { CheckCircleIcon, RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Select,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/react";
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
    selectAll
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
    alert(`${observationData.n} ${t("observation:select_all")}`);
    handleBulkCheckbox("selectAll");
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
      {observationData && observationData.n > -1 && (
        <Flex mb={4} justifyContent="space-between" alignItems="center">
          <Text color="gray.600">
            {format(observationData.n)} {t("observation:list.observations_found")}
          </Text>
          {bulkObservationIds && bulkObservationIds?.length > 0 && (
            <ButtonGroup size="sm" variant="outline">
              {!selectAll && (
                <Button
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<CheckCircleIcon />}
                  onClick={handleSelectAll}
                >
                  {t("observation:selectAll")}
                </Button>
              )}
              <Button
                variant="outline"
                colorScheme="red"
                leftIcon={<RepeatIcon />}
                onClick={() => handleBulkCheckbox("UnsSelectAll")}
              >
                {t("observation:unselect")}
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                leftIcon={<SettingsIcon />}
                onClick={openBulkMappingModal}
              >
                {t("observation:actions")}
              </Button>
            </ButtonGroup>
          )}
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
