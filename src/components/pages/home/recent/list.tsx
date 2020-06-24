import { AspectRatioBox, Box } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { ObservationListMinimalData } from "@interfaces/observation";
import { axGetListData } from "@services/observation.service";
import { OBSERVATION_FALLBACK } from "@static/inline-images";
import { getObservationThumbnail } from "@utils/media";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";
import LazyImage from "react-cool-img";

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
  const { id: userGroupList } = useStoreState((s) => s.currentGroup);
  const [observatons, setObservations] = useState<ObservationListMinimalData[]>(
    Array(OBSERVATIONS_SIZE).fill(null)
  );

  useEffect(() => {
    axGetListData({
      sort: "created_on",
      max: OBSERVATIONS_SIZE,
      view: "list_minimal",
      userGroupList
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
            <a>
              <AspectRatioBox maxW="full" ratio={1} borderRadius="lg" overflow="hidden">
                <LazyImage
                  className="o-image lol"
                  loading="lazy"
                  src={getObservationThumbnail(o?.thumbnail, 135)}
                  alt={o?.recoIbp?.scientificName}
                  title={o?.recoIbp?.scientificName}
                  placeholder={OBSERVATION_FALLBACK.DEFAULT}
                />
              </AspectRatioBox>
            </a>
          </LocalLink>
        ))}
      </ObservationBox>
    </Box>
  ) : (
    <div>{t("HOME.NO_RECENT_OBSERVATIONS")}</div>
  );
}
