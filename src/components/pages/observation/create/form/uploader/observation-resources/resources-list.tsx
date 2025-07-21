import { SimpleGrid, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useObservationCreate from "../use-observation-resources";
import DropTarget from "./drop-target";
import ResourceCard from "./resource-card";

interface ResourcesListProps {
  showHint?: boolean;
}

export default function ResourcesList({ showHint }: ResourcesListProps) {
  const { observationAssets } = useObservationCreate();
  const { t } = useTranslation();

  return (
    <>
      {showHint && <Text my={5}>💡 {t("form:description.resources")}</Text>}
      <SimpleGrid borderRadius="lg" columns={[1, 3, 4, 5]} gap={4}>
        {observationAssets?.map((r, index) => (
          <ResourceCard resource={r} key={r.hashKey} index={index} />
        ))}
        <DropTarget assetsSize={observationAssets?.length} />
      </SimpleGrid>
    </>
  );
}
