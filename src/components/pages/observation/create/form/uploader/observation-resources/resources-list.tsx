import { SimpleGrid, Text } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import React from "react";

import useObservationCreate from "../use-observation-resources";
import DropTarget from "./drop-target";
import ResourceCard from "./resource-card";

export default function ResourcesList() {
  const { observationAssets } = useObservationCreate();
  const { t } = useTranslation();

  return (
    <>
      <Text my={5}>💡 {t("OBSERVATION.DESCRIPTION.RESOURCES")}</Text>
      <SimpleGrid borderRadius="lg" columns={[1, 3, 4, 5]} spacing={4}>
        {observationAssets.map((r, index) => (
          <ResourceCard resource={r} key={r.hashKey} index={index} />
        ))}
        <DropTarget assetsSize={observationAssets?.length} />
      </SimpleGrid>
    </>
  );
}
