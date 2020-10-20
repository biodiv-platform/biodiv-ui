import { AspectRatio, Box, Image } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { ObservationListMinimalData } from "@interfaces/observation";
import { axGetListData } from "@services/observation.service";
import { getObservationThumbnail } from "@utils/media";
import React, { useEffect, useState } from "react";

const OBSERVATIONS_SIZE = 8;

const ObservationBox = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(8, 1fr);

  width: 100%;
  min-width: 940px;
  .o-image {
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
`;

export default function RecentObservationList() {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();

  const [observatons, setObservations] = useState<ObservationListMinimalData[]>(
    Array(OBSERVATIONS_SIZE).fill(null)
  );

  useEffect(() => {
    axGetListData({
      sort: "created_on",
      max: OBSERVATIONS_SIZE,
      view: "list_minimal",
      userGroupList: currentGroup.id
    }).then(({ data }) => {
      setObservations(data?.observationListMinimal || []);
    });
  }, []);

  return observatons.length ? (
    <Box
      bg="white"
      p={4}
      borderRadius="lg"
      border="2px solid"
      borderColor="gray.200"
      overflowX="auto"
    >
      <ObservationBox>
        {observatons.map((o, index) => (
          <LocalLink
            href={o?.observationId ? `/observation/show/${o?.observationId}` : null}
            prefixGroup={true}
            key={index}
          >
            <a aria-label={o?.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}>
              <AspectRatio maxW="full" ratio={1} borderRadius="lg" overflow="hidden">
                <Image
                  className="o-image"
                  loading="lazy"
                  ignoreFallback={true}
                  bg="gray.200"
                  src={getObservationThumbnail(o?.thumbnail, 135)}
                  alt={o?.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}
                />
              </AspectRatio>
            </a>
          </LocalLink>
        ))}
      </ObservationBox>
    </Box>
  ) : (
    <div>{t("HOME.NO_RECENT_OBSERVATIONS")}</div>
  );
}
