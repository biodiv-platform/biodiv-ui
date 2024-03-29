import { Button } from "@chakra-ui/button";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import usePullMedia from "../pull-media/use-pull-media";
import { SpeciesGalleryImage } from "./image";

export default function ObservationMedia() {
  const { isLoading, loadMoreResources, resourcesList } = usePullMedia({
    noPayloadModification: true
  });
  const { t } = useTranslation();

  return (
    <>
      <SpeciesGalleryImage isLoading={isLoading} resources={resourcesList.list} />
      <Button
        w="full"
        disabled={!resourcesList.hasMore}
        onClick={loadMoreResources}
        isLoading={isLoading}
        mb={4}
      >
        {t("common:load_more")}
      </Button>
    </>
  );
}
