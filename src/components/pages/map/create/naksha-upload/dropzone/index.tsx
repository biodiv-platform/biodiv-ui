import { Box, FileUpload, Flex, SimpleGrid, Tabs, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback, useMemo } from "react";

import { Tooltip } from "@/components/ui/tooltip";

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

  const handleFileChange = useCallback(
    async (details: { acceptedFiles: File[]; rejectedFiles: any[] }) => {
      for (const file of details.acceptedFiles) {
        if (file.name.endsWith(FILE_TYPES.DBF)) {
          parseDBF(file, updateMapFile);
        } else if (file.name.endsWith(FILE_TYPES.SHP)) {
          parseSHP(file, updateMapFile);
        } else {
          parseDefault(file, updateMapFile);
        }
      }
    },
    [updateMapFile]
  );

  const handleTabInex = (val) => {
    switch (val) {
      case "vector":
        setMapFileType(MapFileType.vector);
        break;
      case "raster":
        setMapFileType(MapFileType.raster);
        break;
    }
  };

  const allowedExtensions = useMemo(() => {
    return Object.values(mapFileType === MapFileType.raster ? RASTER_FILE_TYPES : FILE_TYPES);
  }, [mapFileType]);

  const acceptString = useMemo(() => {
    return allowedExtensions.join(",");
  }, [allowedExtensions]);

  return (
    <VerticalTabs>
      <Tabs.Root
        className="tabs"
        onValueChange={(e) => handleTabInex(e.value)}
        lazyMount
        defaultValue={"vector"}
        variant={"outline"}
      >
        <Tabs.List>
          <Tabs.Trigger value={"vector"}>
            <Tooltip content={t("Vector")}>
              <div>{t("Vector")}</div>
            </Tooltip>
          </Tabs.Trigger>
          <Tabs.Trigger value={"raster"}>
            <Tooltip content={t("RASTER")}>
              <div>{t("Raster")}</div>
            </Tooltip>
          </Tabs.Trigger>
          <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
        </Tabs.List>
        <Flex ml={2} height={["100%"]} className="tab-content" position="relative">
          {Object.keys(MapFileType).map((index) => (
            <Tabs.Content value={index} h="inherit" key={index}>
              <SimpleGrid columns={{ base: 1, md: 7 }} gap={4} h="100%">
                <FileUpload.Root
                  accept={acceptString}
                  onFileChange={handleFileChange}
                  maxFiles={30}
                  gridColumn="1/6"
                  h="100%"
                >
                  <FileUpload.HiddenInput />

                  <FileUpload.Context>
                    {(fileUpload) => (
                      <FileUpload.Dropzone
                        width="full"
                        h="100%"
                        bg={fileUpload.dragging ? "blue.50" : "gray.50"}
                        border="1px dashed"
                        borderColor={fileUpload.dragging ? "blue.500" : "gray.300"}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        p={4}
                      >
                        <Box textAlign="center">
                          {fileUpload.dragging ? (
                            <Box color="blue.500" fontWeight="bold">
                              {t("map:drag_active")}
                            </Box>
                          ) : (
                            <>
                              {t("map:drop_message")}
                              <br />
                              <Text color="gray.500" mt={1}>
                                {allowedExtensions.join(", ")} {t("map:only")}
                              </Text>
                            </>
                          )}
                        </Box>
                      </FileUpload.Dropzone>
                    )}
                  </FileUpload.Context>
                </FileUpload.Root>

                <FilePreview />
              </SimpleGrid>
            </Tabs.Content>
          ))}
        </Flex>
      </Tabs.Root>
    </VerticalTabs>
  );
}
