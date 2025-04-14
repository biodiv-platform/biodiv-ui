import { AspectRatio, Box, Button, Image, Link, SimpleGrid, Skeleton } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import ScientificName from "@components/@core/scientific-name";
import Tooltip from "@components/@core/tooltip";
import { RESOURCE_SIZE } from "@static/constants";
import { getLocalIcon, getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useSpecies from "../../use-species";
import useSpeciesOccurancesList from "./use-related-observations";

export default function SpeciesRelatedObservations() {
  const { t } = useTranslation();
  const { species } = useSpecies();
  const { speciesOccurances, loadMore } = useSpeciesOccurancesList(species.species.taxonConceptId);

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📷 {t("species:related.title")}</BoxHeading>
      <SimpleGrid className="fade" w="full" columns={4} gap={4} p={4}>
        {speciesOccurances.list.map((observation) => {
          const title = observation?.recoIbp?.scientificName || t("common:unknown");
          return (
            <LocalLink
              href={`/observation/show/${observation.observationId}`}
              key={observation.observationId}
            >
              <Link target="_blank" className="fade">
                <Tooltip showArrow={true} title={<ScientificName value={title} />}>
                  <AspectRatio ratio={1}>
                    <Image
                      borderRadius="md"
                      bg="gray.300"
                      loading="lazy"
                      alt={title}
                      src={
                        observation.thumbnail
                          ? getResourceThumbnail(
                              RESOURCE_CTX.OBSERVATION,
                              observation.thumbnail,
                              RESOURCE_SIZE.LIST_THUMBNAIL
                            )
                          : getLocalIcon(observation.speciesGroup)
                      }
                    />
                  </AspectRatio>
                </Tooltip>
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
        loading={speciesOccurances.isLoading}
        onClick={() => loadMore()}
      >
        {t("common:load_more")}
      </Button>
    </Box>
  );
}
