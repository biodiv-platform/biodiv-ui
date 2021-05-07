import { Grid, GridItem, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import { SpeciesActivity } from "./activity";
import SpeciesCommonNames from "./common-names";
import SpeciesFields from "./fields";
import SpeciesGallery from "./gallery";
import SpeciesGroups from "./group";
import SpeciesHeader from "./header";
import SpeciesNavigation from "./navigation";
import SpeciesSidebar from "./sidebar";
import SpeciesSynonyms from "./synonyms";
import { SpeciesProvider } from "./use-species";

export default function SpeciesShowPageComponent({ species, permissions }) {
  console.debug("Species", species, permissions);

  return (
    <SpeciesProvider species={species} permissions={permissions}>
      <div className="container mt">
        <SimpleGrid columns={{ md: 3 }} spacing={{ md: 4 }}>
          <SpeciesHeader />
          <SpeciesGallery />
        </SimpleGrid>

        <Grid templateColumns="repeat(6, 1fr)" gap={4} mb={4}>
          <SpeciesNavigation />
          <GridItem colSpan={3}>
            <SpeciesSynonyms />
            <SpeciesCommonNames />
            <SpeciesFields />
          </GridItem>
          <SpeciesSidebar />
        </Grid>

        <SpeciesGroups />
        <SpeciesActivity />
      </div>
    </SpeciesProvider>
  );
}
