import {
  Box,
  Flex,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

import { FILE_TYPES, RASTER_FILE_TYPES } from "../data";
import useLayerUpload, { MapFileType } from "../use-layer-upload";
import FilePreview from "./file-preview";
import { parseDBF, parseDefault, parseSHP } from "./parsers";

export const VerticalTabs = styled.div`
  flex-grow: 1;
  height: 100%;
  .tabs {
    display: flex;
    height: inherit;
    > .tab-content {
      flex-grow: 1;
      > [role="tabpanel"] {
        padding: 0;
        height: 100%;
        overflow-y: auto;
        position: relative;
      }
    }
    > [role="tablist"] {
      flex-direction: column;
      flex-shrink: 0;
      > [role="tab"] {
        display: block;
        width: 100%;
        height: 3rem;
        text-align: left;
        white-space: nowrap;
        color: var(--chakra-colors-gray-600);
        border-bottom: 1px solid var(--chakra-colors-gray-300);
        border-left: 1px solid var(--chakra-colors-gray-300);
        background: var(--chakra-colors-gray-50);
        filter: grayscale(1);
      }
      > [role="tab"]:last-child {
        border-bottom: 0;
      }
      > [role="tab"][aria-selected="true"] {
        white-space: nowrap;
        color: inherit;
        border-left-color: transparent;
        background: white;
        filter: none;
      }
    }
  }
  ${Mq.max.sm} {
    .tabs {
      display: flex;
      flex-direction: column-reverse;
      > [role="tablist"] {
        overflow-x: scroll;
        flex-direction: row;
        width: 100%;
      }
    }
  }
  ${Mq.min.md + " and (max-width: 1024px)"} {
    [role="tab"] span {
      display: none;
    }
  }
`;

export default function LayerUploadDropzone() {
  const { updateMapFile, mapFileType, setMapFileType } = useLayerUpload();
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState(0);

  const onDrop = async (files) => {
    for (const file of files) {
      if (file.name.endsWith(FILE_TYPES.DBF)) {
        parseDBF(file, updateMapFile);
      } else if (file.name.endsWith(FILE_TYPES.SHP)) {
        parseSHP(file, updateMapFile);
      } else {
        parseDefault(file, updateMapFile);
      }
    }
  };

  const handleTabInex = (val) => {
    switch (val) {
      case 0:
        setMapFileType(MapFileType.vector);
        break;
      case 1:
        setMapFileType(MapFileType.raster);
        break;
    }
    setTabIndex(val);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "*/*": Object.values(mapFileType === MapFileType.raster ? RASTER_FILE_TYPES : FILE_TYPES)
    },
    multiple: true
  });

  return (
    <VerticalTabs>
      <Tabs
        variant="unstyled"
        className="tabs"
        index={tabIndex}
        onChange={handleTabInex}
        isLazy={true}
      >
        <TabList>
          <Tab>
            <Tooltip title={t("Vector")}>
              <div>{t("Vector")}</div>
            </Tooltip>
          </Tab>
          <Tab>
            <Tooltip title={t("Raster")}>
              <div>{t("Raster")}</div>
            </Tooltip>
          </Tab>
          <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
        </TabList>
        <TabPanels ml={2} height={["100%"]} className="tab-content" position="relative">
          {Object.keys(MapFileType).map(() => (
            <TabPanel h="inherit">
              <SimpleGrid columns={{ base: 1, md: 7 }} spacing={4} h="100%">
                <Flex
                  {...getRootProps()}
                  gridColumn="1/6"
                  h="inherit"
                  bg="gray.50"
                  border="1px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  alignItems="center"
                  justifyContent="center"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <Box>{t("map:drag_active")}</Box>
                  ) : (
                    <Box textAlign="center">
                      {t("map:drop_message")}
                      <br />
                      <Text color="gray.500">
                        {Object.values(
                          mapFileType === MapFileType.raster ? RASTER_FILE_TYPES : FILE_TYPES
                        ).join(", ")}{" "}
                        {t("map:only")}
                      </Text>
                    </Box>
                  )}
                </Flex>
                <FilePreview />
              </SimpleGrid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </VerticalTabs>
  );
}
