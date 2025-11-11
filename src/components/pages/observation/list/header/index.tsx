import { Box, Button, Flex, HStack, Stack, Tabs, Text, useDisclosure } from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import DownloadIcon from "@icons/download";
import { sortByOptions, viewTabs } from "@static/observation-list";
import { waitForAuth } from "@utils/auth";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense } from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";

const DownloadObservationDataModal = React.lazy(() => import("../download-observation-modal"));

export default function ListHeader() {
  const { filter, setFilter, observationData, allMedia, addMediaToggle } = useObservationFilter();
  const { t } = useTranslation();
  const { open, onOpen, onClose } = useDisclosure();

  const handleOnViewChange = (e) => {
    console.error("handleOnViewChange", e);
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.view = e;
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

  const handleMediaToggle = (e) => {
    addMediaToggle(e);
  };

  return (
    <>
      <Flex mt={4} direction={{ base: "column", md: "row" }} justify="space-between">
        <Tabs.Root
          display="inline-block"
          className="icon-tabs"
          onValueChange={(e) => handleOnViewChange(e.value)}
          defaultValue={viewTabs[0].key}
          activationMode="manual"
          mb={4}
          lazyMount
        >
          <Tabs.List aria-orientation="vertical">
            {viewTabs.map(({ name, icon, key }) => (
              <Tabs.Trigger
                key={key}
                value={key}
                aria-label={t(name)}
                aria-controls={`view_${key}`}
              >
                {icon} {t(name)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
        <Stack direction="row" gap={4} mb={4}>
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
          <Button variant="outline" colorPalette="blue" onClick={onListDownload}>
            <DownloadIcon />
            {t("observation:download.title")}
          </Button>
        </Stack>
      </Flex>

      {observationData && observationData.n > -1 && (
        <Flex mb={4} justifyContent="space-between" minH="32px" alignItems="center">
          <HStack gap={4}>
            <Box>
              <HStack gap={1}>
                <Text color="gray.600">
                  {format(observationData.n)} {t("common:temporal.observations")}
                </Text>
                <Text color={allMedia ? "gray.300" : "gray.600"}>
                  {t("observation:media_toggle.with_media")}
                </Text>
              </HStack>
            </Box>
            <Switch
              defaultChecked={allMedia}
              id="media-toggle"
              onChange={handleMediaToggle}
              colorPalette="blue"
              border="1px solid"
              borderColor="gray.500"
              borderRadius="50px"
            />
            <Text color={allMedia ? "gray.600" : "gray.300"}>
              {t("observation:media_toggle.all")}
            </Text>
          </HStack>
        </Flex>
      )}

      {open && (
        <Suspense fallback={null}>
          <DownloadObservationDataModal isOpen={open} onClose={onClose} />
        </Suspense>
      )}
    </>
  );
}
