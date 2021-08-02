import { Grid, GridItem, SimpleGrid } from "@chakra-ui/react";
import React from "react";

import { SpeciesActivity } from "./activity";
import SpeciesCommonNamesContainer from "./common-names";
import SpeciesFields from "./fields";
import SpeciesGallery from "./gallery";
import SpeciesGroups from "./group";
import SpeciesHeader from "./header";
import SpeciesNavigation from "./navigation";
import SpeciesSidebar from "./sidebar";
import SpeciesSynonymsContainer from "./synonyms";
import { SpeciesProvider } from "./use-species";

export default function SpeciesShowPageComponent({ species, permissions, licensesList }) {
  console.debug("Species", species, permissions);

  return (
    <SpeciesProvider species={species} permissions={permissions} licensesList={licensesList}>
      <div className="container mt">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ md: 4 }}>
          <SpeciesHeader />
          <SpeciesGallery />
        </SimpleGrid>

        <Grid templateColumns={{ md: "repeat(6, 1fr)" }} gap={4} mb={4}>
          <GridItem colSpan={4}>
            <SpeciesNavigation />
            <SpeciesSynonymsContainer />
            <SpeciesCommonNamesContainer />
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
