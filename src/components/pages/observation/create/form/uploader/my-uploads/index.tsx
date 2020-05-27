import { Box, Button, CheckboxGroup, Flex, Select, Spinner, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import dynamic from "next/dynamic";
import React from "react";

import { MY_UPLOADS_SORT } from "../../options";
import useObservationCreate from "../use-observation-resources";
import Checkbox from "./checkbox";

const DropTarget = dynamic(import("./drop-target"), { ssr: false });

const MyUploadsImages = ({ onDone }) => {
  const { assets, observationAssets, resourcesSortBy, setResourcesSortBy } = useObservationCreate();
  const { t } = useTranslation();

  const handleOnSort = (e) => {
    setResourcesSortBy(e.target.value);
  };

  return assets ? (
    <Box>
      <Flex
        direction={["column", "column", "row", "row"]}
        justify="space-between"
        alignItems="center"
        mb={2}
      >
        <Text mb={2}>💡 {t("OBSERVATION.DESCRIPTION.MY_UPLOADS")}</Text>
        <Flex>
          <Select mr={4} value={resourcesSortBy} onChange={handleOnSort} maxW="10rem">
            {MY_UPLOADS_SORT.map((o) => (
              <option key={o.value} value={o.value}>
                {t(`OBSERVATION.MY_UPLOADS_SORT.${o.label}`)}
              </option>
            ))}
          </Select>
          <Button
            flexShrink={0}
            type="button"
            leftIcon="check"
            onClick={onDone}
            variantColor="blue"
          >
            {t("OBSERVATION.USE_IN_OBSERVATION")}
          </Button>
        </Flex>
      </Flex>
      <CheckboxGroup
        value={observationAssets.map((o) => o.hashKey)}
        display="grid"
        className="custom-checkbox-group"
        gridGap={4}
        gridTemplateColumns={["repeat(3,1fr)", "repeat(4,1fr)", "repeat(5,1fr)", `repeat(8,1fr)`]}
      >
        <DropTarget />
        {assets.map((asset, index) => (
          <Checkbox key={asset.hashKey} value={asset.hashKey} index={index} asset={asset} />
        ))}
      </CheckboxGroup>
    </Box>
  ) : (
    <Spinner mt={4} />
  );
};

export default MyUploadsImages;
