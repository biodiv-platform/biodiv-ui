import { Box, Button, Flex, SimpleGrid, Spinner, Text, useCheckboxGroup } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";

import { MY_UPLOADS_SORT } from "../../options";
import useObservationCreate from "../use-observation-resources";
import Checkbox from "./checkbox";
import DropTarget from "./drop-target";

const MyUploadsImages = ({ onDone, hasTabs = true }) => {
  const { assets, observationAssets, resourcesSortBy, setResourcesSortBy } = useObservationCreate();
  const { t } = useTranslation();

  const handleOnSort = (e) => {
    setResourcesSortBy(e.target.value);
  };

  const { getItemProps } = useCheckboxGroup({
    value: observationAssets?.map((o) => o.hashKey)
  });

  return assets ? (
    <Box>
      <Flex
        direction={["column", "column", "row", "row"]}
        justify="space-between"
        alignItems="center"
        mb={2}
      >
        <Text mb={2}>💡 {t("form:description.my_uploads")}</Text>
        <Flex>
          <NativeSelectRoot
            mr={4}
            defaultValue={resourcesSortBy}
            onChange={handleOnSort}
            maxW="10rem"
          >
            <NativeSelectField>
              {MY_UPLOADS_SORT.map((o) => (
                <option key={o.value} value={o.value}>
                  {t(`form:my_uploads_sort.${o.label}`)}
                </option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
          {hasTabs && (
            <Button flexShrink={0} type="button" onClick={onDone} colorPalette="blue">
              <CheckIcon />
              {t("form:use_in_observation")}
            </Button>
          )}
        </Flex>
      </Flex>
      <SimpleGrid columns={[3, 4, 5, 8]} gridGap={4} className="custom-checkbox-group">
        <DropTarget />
        {assets.map((asset) => (
          <Checkbox key={asset.hashKey} asset={asset} {...getItemProps({ value: asset.hashKey })} />
        ))}
      </SimpleGrid>
    </Box>
  ) : (
    <Spinner mt={4} />
  );
};

export default MyUploadsImages;
