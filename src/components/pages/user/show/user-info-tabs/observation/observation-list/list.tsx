import { AspectRatio, Box, Button, Flex, Image, Link, SimpleGrid, Skeleton } from "@chakra-ui/core";
import ExternalBlueLink from "@components/@core/blue-link/external";
import LocalLink from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "@hooks/use-translation";
import { RESOURCE_SIZE } from "@static/constants";
import { getObservationImage, getSpeciesIcon } from "@utils/media";
import React from "react";

export default function ObservationList({ title, data, loadMore }) {
  const { t } = useTranslation();

  return (
    <Box mb={4}>
      <Flex justifyContent="space-between">
        <Box fontWeight="bold" mb={2}>
          {title} ({data.total})
        </Box>
        <LocalLink href="/observation/list" params={data.link}>
          <ExternalBlueLink>{t("USER.VIEW_ALL")}</ExternalBlueLink>
        </LocalLink>
      </Flex>
      <SimpleGrid columns={{ base: 2, sm: 4, md: 6, lg: 8 }} spacing={4}>
        {data.list.map((observation) => {
          const title = observation?.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN");
          return (
            <LocalLink
              href={`/observation/show/${observation.observationId}`}
              key={observation.observationId}
            >
              <Link target="_blank" className="fade">
                <Tooltip title={title} hasArrow={true}>
                  <AspectRatio ratio={1}>
                    <Image
                      borderRadius="md"
                      bg="gray.300"
                      alt={title}
                      src={getObservationImage(observation.thumbnail, RESOURCE_SIZE.LIST_THUMBNAIL)}
                      fallbackSrc={getSpeciesIcon(observation.speciesGroup)}
                    />
                  </AspectRatio>
                </Tooltip>
              </Link>
            </LocalLink>
          );
        })}
        {data.isLoading &&
          new Array(16).fill(null).map((_, index) => (
            <AspectRatio ratio={1} key={index}>
              <Skeleton borderRadius="md" />
            </AspectRatio>
          ))}
      </SimpleGrid>
      <Button
        w="full"
        hidden={!data.hasMore}
        className="fade"
        isLoading={data.isLoading}
        onClick={() => loadMore()}
        mt={4}
      >
        {t("OBSERVATION.LOAD_MORE_OBSERVATIONS")}
      </Button>
    </Box>
  );
}
