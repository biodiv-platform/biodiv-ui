import {
  Box,
  Button,
  Flex,
  Select,
  SimpleGrid,
  Spinner,
  Text,
  useCheckboxGroup
} from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import React from "react";

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

  const { getCheckboxProps } = useCheckboxGroup({
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
        <Text mb={2}>💡 {t("OBSERVATION.DESCRIPTION.MY_UPLOADS")}</Text>
        <Flex>
          <Select mr={4} value={resourcesSortBy} onChange={handleOnSort} maxW="10rem">
            {MY_UPLOADS_SORT.map((o) => (
              <option key={o.value} value={o.value}>
                {t(`OBSERVATION.MY_UPLOADS_SORT.${o.label}`)}
              </option>
            ))}
          </Select>
          {hasTabs && (
            <Button
              flexShrink={0}
              type="button"
              leftIcon={<CheckIcon />}
              onClick={onDone}
              colorScheme="blue"
            >
              {t("OBSERVATION.USE_IN_OBSERVATION")}
            </Button>
          )}
        </Flex>
      </Flex>
      <SimpleGrid columns={[3, 4, 5, 8]} gridGap={4} className="custom-checkbox-group">
        <DropTarget />
        {assets.map((asset) => (
          <Checkbox
            key={asset.hashKey}
            asset={asset}
            {...getCheckboxProps({ value: asset.hashKey })}
          />
        ))}
      </SimpleGrid>
    </Box>
  ) : (
    <Spinner mt={4} />
  );
};

export default MyUploadsImages;
