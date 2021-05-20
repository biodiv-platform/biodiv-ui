import { AspectRatio, Box, Button, Image, Link, SimpleGrid, Skeleton } from "@chakra-ui/react";
import { RESOURCE_CTX, getLocalIcon, getResourceThumbnail } from "@utils/media";

import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import { RESOURCE_SIZE } from "@static/constants";
import React from "react";
import useSpecies from "../../use-species";
import useSpeciesOccurancesList from "./use-related-observations";
import useTranslation from "@hooks/use-translation";

export default function SpeciesRelatedObservations() {
  const { t } = useTranslation();
  const { species } = useSpecies();
  const { speciesOccurances, loadMore } = useSpeciesOccurancesList(species.species.taxonConceptId);

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📷 {t("SPECIES.RELATED.TITLE")}</BoxHeading>
      <SimpleGrid className="fade" w="full" columns={4} spacing={4} p={4}>
        {speciesOccurances.list.map((observation) => {
          const title = observation?.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN");
          return (
            <LocalLink
              href={`/observation/show/${observation.observationId}`}
              key={observation.observationId}
            >
              <Link target="_blank" className="fade">
                <AspectRatio ratio={1}>
                  <Image
                    borderRadius="md"
                    bg="gray.300"
                    alt={title}
                    title={title}
                    src={getResourceThumbnail(
                      RESOURCE_CTX.OBSERVATION,
                      observation.thumbnail,
                      RESOURCE_SIZE.LIST_THUMBNAIL
                    )}
                    fallbackSrc={getLocalIcon(observation.speciesGroup)}
                  />
                </AspectRatio>
              </Link>
            </LocalLink>
          );
        })}

        {speciesOccurances.isLoading &&
          new Array(16).fill(null).map((_, index) => (
            <AspectRatio ratio={1} key={index}>
              <Skeleton borderRadius="md" />
            </AspectRatio>
          ))}
      </SimpleGrid>

      <Button
        w="full"
        rounded={0}
        hidden={!speciesOccurances.hasMore}
        isLoading={speciesOccurances.isLoading}
        onClick={() => loadMore()}
      >
        {t("OBSERVATION.LOAD_MORE_OBSERVATIONS")}
      </Button>
    </Box>
  );
}
