import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { useCheckboxGroup } from "@/hooks/use-checkbox-group";

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
        <Button type="button" onClick={onDone} colorPalette="blue">
          <CheckIcon />
          {t("form:use_in_observation")}
        </Button>
      </Box>
      <SimpleGrid columns={[2, 3, 4, 5]} gridGap={4} mb={4} className="custom-checkbox-group">
        {resourcesList.list.map((asset) => (
          <Checkbox key={asset.id} asset={asset} {...getCheckboxProps({ value: asset.id })} />
        ))}
      </SimpleGrid>
      <Button
        w="full"
        disabled={!resourcesList.hasMore}
        loading={isLoading}
        onClick={loadMoreResources}
      >
        {t("common:load_more")}
      </Button>
    </Box>
  );
};

export default SpeciesPullMedia;
