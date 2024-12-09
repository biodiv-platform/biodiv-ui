import { Box, Grid, GridItem, ListItem, OrderedList, SimpleGrid } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import React, { useMemo } from "react";

import { SpeciesActivity } from "./activity";
import SpeciesCommonNamesContainer from "./common-names";
import SpeciesFields from "./fields";
import { generateReferencesList } from "./fields/field/references/utils";
import SpeciesGallery from "./gallery";
import SpeciesGroups from "./group";
import SpeciesHeader from "./header";
import SpeciesNavigation from "./navigation";
import SpeciesSidebar from "./sidebar";
import SpeciesSynonymsContainer from "./synonyms";
import { SpeciesProvider } from "./use-species";

export default function SpeciesShowPageComponent({ species, permissions, licensesList }) {
  console.debug("Species", species, permissions);

  const fieldsRender = useMemo(
    () => generateReferencesList(species.fieldData),
    [species.fieldData]
  );

  // const commonRender = useMemo(
  //   () => generateReferencesList(species.fieldData),
  //   [species.fieldData]
  // );

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

            {/*
            This should be the new component 
            */}

            <ToggleablePanel id="123" icon="📚" title="References">
              <Box p={4} pb={0}>
                {fieldsRender.map(([path, references]) => (
                  <Box key={path} mb={3}>
                    <Box fontWeight={600} fontSize="md" mb={1}>
                      {path}
                    </Box>
                    <OrderedList>
                      {references.map(([title, url], index) => (
                        <ListItem key={index}>
                          {title} {url && <ExternalBlueLink href={url} />}
                        </ListItem>
                      ))}
                    </OrderedList>
                  </Box>
                ))}
              </Box>
              <Box p={4} pb={0}>
                <Box fontSize="md" mb={1}>
                  <Box fontWeight={600} fontSize="md" mb={1}>
                    Common references
                  </Box>
                  <Box>
                    <OrderedList>
                      {species.referencesListing.map((r) => (
                        <ListItem key={r.id}>
                          {r.title} {r.url && <ExternalBlueLink href={r.url} />}
                        </ListItem>
                      ))}
                    </OrderedList>
                  </Box>
                </Box>
              </Box>
            </ToggleablePanel>
          </GridItem>
          <SpeciesSidebar />
        </Grid>

        <SpeciesGroups />
        <SpeciesActivity />
      </div>
    </SpeciesProvider>
  );
}
