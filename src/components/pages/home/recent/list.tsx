import { AspectRatio, Box, Image, SimpleGrid, Skeleton } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { ObservationListMinimalData } from "@interfaces/observation";
import { axGetListData } from "@services/observation.service";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import React, { useEffect, useState } from "react";

const OBSERVATIONS_SIZE = 10;

export default function RecentObservationList() {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();
  const [isLoading, setIsLoading] = useState(true);

  const [observations, setObservations] = useState<ObservationListMinimalData[]>([]);

  useEffect(() => {
    axGetListData({
      sort: "created_on",
      max: OBSERVATIONS_SIZE,
      view: "list_minimal",
      userGroupList: currentGroup.id
    }).then(({ data }) => {
      setObservations(data?.observationListMinimal || []);
      setIsLoading(false);
    });
  }, []);

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      overflowX="auto"
    >
      <SimpleGrid columns={{ base: 2, sm: 6, md: 8, lg: 10 }} spacing={4}>
        {isLoading ? (
          Array(OBSERVATIONS_SIZE)
            .fill(null)
            .map((_, i) => (
              <AspectRatio ratio={1} key={i}>
                <Skeleton borderRadius="md" />
              </AspectRatio>
            ))
        ) : observations.length ? (
          observations.map((o) => (
            <LocalLink
              href={`/observation/show/${o?.observationId}`}
              prefixGroup={true}
              key={o.observationId}
            >
              <a aria-label={o?.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}>
                <AspectRatio ratio={1}>
                  <Image
                    objectFit="cover"
                    borderRadius="md"
                    loading="lazy"
                    ignoreFallback={true}
                    bg="gray.200"
                    src={getResourceThumbnail(
                      RESOURCE_CTX.OBSERVATION,
                      o?.thumbnail,
                      RESOURCE_SIZE.RECENT_THUMBNAIL
                    )}
                    alt={o?.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}
                  />
                </AspectRatio>
              </a>
            </LocalLink>
          ))
        ) : (
          <div>{t("HOME.NO_RECENT_OBSERVATIONS")}</div>
        )}
      </SimpleGrid>
    </Box>
  );
}
