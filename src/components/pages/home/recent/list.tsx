import { AspectRatio, Box, Image, SimpleGrid, Skeleton } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import { ObservationListMinimalData } from "@interfaces/observation";
import { axGetListData } from "@services/observation.service";
import { RESOURCE_SIZE } from "@static/constants";
import { getLocalIcon, getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
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
              <a aria-label={o?.recoIbp?.scientificName || t("common:unknown")}>
                <AspectRatio ratio={1}>
                  <Image
                    objectFit="cover"
                    borderRadius="md"
                    bg="gray.200"
                    src={getResourceThumbnail(
                      RESOURCE_CTX.OBSERVATION,
                      o?.thumbnail,
                      RESOURCE_SIZE.RECENT_THUMBNAIL
                    )}
                    fallbackSrc={getLocalIcon(o?.speciesGroup)}
                    alt={o?.recoIbp?.scientificName || t("common:unknown")}
                  />
                </AspectRatio>
              </a>
            </LocalLink>
          ))
        ) : (
          <div>{t("home:no_recent_observations")}</div>
        )}
      </SimpleGrid>
    </Box>
  );
}
