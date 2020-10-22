import {
  Box,
  Button,
  Flex,
  Select,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/core";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import useTranslation from "@hooks/use-translation";
import DownloadIcon from "@icons/download";
import { sortByOptions, viewTabs } from "@static/observation-list";
import { format } from "indian-number-format";
import React from "react";

import DownloadObservationDataModal from "../download-observation-modal";

export default function ListHeader() {
  const { filter, setFilter, observationData } = useObservationFilter();
  const defaultIndex = viewTabs.findIndex((t) => t.key === filter.view);
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
              aria-label={t("LIST.SORT_BY")}
              value={filter.sort}
              onChange={handleOnSort}
            >
              {sortByOptions.map(({ name, key }) => (
                <option key={key} value={key}>
                  {t(name)}
                </option>
              ))}
            </Select>
          </Box>
          <Button variant="outline" colorScheme="blue" leftIcon={<DownloadIcon />} onClick={onOpen}>
            {t("OBSERVATION.DOWNLOAD.TITLE")}
          </Button>
        </Stack>
      </Flex>

      {observationData.n > 0 && (
        <Text color="gray.600" mb={4}>
          {format(observationData.n)} {t("LIST.OBSERVATIONS_FOUND")}
        </Text>
      )}

      {isOpen && <DownloadObservationDataModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
}
