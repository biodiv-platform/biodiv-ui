import { Box, Button, SimpleGrid, useCheckboxGroup } from "@chakra-ui/react";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import React from "react";

import Checkbox from "./checkbox";
import usePullMedia from "./use-pull-media";

const SpeciesPullMedia = ({ onDone }) => {
  const { observationAssets } = useObservationCreate();
  const { isLoading, loadMoreResources, resourcesList } = usePullMedia();
  const { t } = useTranslation();

  const { getCheckboxProps } = useCheckboxGroup({
    value: observationAssets?.map((o) => o.id) as any
  });

  return (
    <Box>
      <Box mb={4}>
        <Button type="button" leftIcon={<CheckIcon />} onClick={onDone} colorScheme="blue">
          {t("OBSERVATION.USE_IN_OBSERVATION")}
        </Button>
      </Box>
      <SimpleGrid columns={[3, 4, 5, 8]} gridGap={4} mb={4} className="custom-checkbox-group">
        {resourcesList.list.map((asset) => (
          <Checkbox key={asset.id} asset={asset} {...getCheckboxProps({ value: asset.id })} />
        ))}
      </SimpleGrid>
      <Button
        w="full"
        disabled={!resourcesList.hasMore}
        isLoading={isLoading}
        onClick={loadMoreResources}
      >
        {t("LOAD_MORE")}
      </Button>
    </Box>
  );
};

export default SpeciesPullMedia;
