import { Avatar, Box, Flex, Image, Link, Text } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { ObservationHomePage } from "@interfaces/observation";
import { HERO_FALLBACK } from "@static/home";
import { getObservationThumbnail, getUserImage } from "@utils/media";
import EmblaCarouselReact from "embla-carousel-react";
import { Mq } from "mq-styled-components";
import React, { useEffect, useState } from "react";

import Indicators from "./indicators";

const CarouselContainer = styled.div`
  height: 500px;
  position: relative;
  overflow: hidden;
  align-items: stretch;
  flex-grow: 1;
  .is-draggable,
  .carousel {
    height: 100%;
  }
  .carousel {
    align-items: stretch;
    display: flex;
    & > a {
      position: relative;
      align-items: stretch;
      flex: 0 0 100%;
      object-fit: cover;
    }
    img {
      height: 100%;
      width: 100%;
    }
  }
  .slide-content {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 2rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  }

  ${Mq.max.md} {
    height: 420px;
  }

  ${Mq.max.sm} {
    height: 240px;
    .slide-content {
      padding: 0.8rem;
    }
  }
`;

interface ISlidesProps {
  featured: ObservationHomePage[];
  slideIndex;
  onChange;
}

export default function Slides({ featured, slideIndex, onChange }: ISlidesProps) {
  const [embla, setEmbla] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    embla &&
      embla.on("settle", () => {
        onChange(embla.selectedScrollSnap());
      });
  }, [embla]);

  return (
    <CarouselContainer>
      <EmblaCarouselReact emblaRef={setEmbla} options={{ loop: true }}>
        <div className="carousel">
          {featured.map((o, index) => (
            <LocalLink
              key={index}
              href={`/observation/show/${o.observation.observationId}`}
              prefixGroup={true}
            >
              <a>
                <Image
                  objectFit="cover"
                  src={getObservationThumbnail(o?.resourceUrl, 500)}
                  alt={o.observation?.recoIbp?.scientificName}
                  fallbackSrc={HERO_FALLBACK}
                />
              </a>
            </LocalLink>
          ))}
        </div>
      </EmblaCarouselReact>
      <div className="slide-content">
        <LocalLink href={`/user/show/${featured[slideIndex].observation.user.id}`}>
          <Link>
            <Flex alignItems="center">
              <Avatar
                mr={2}
                flexShrink={0}
                size="sm"
                name={featured[slideIndex].observation.user.name}
                src={getUserImage(featured[slideIndex].observation.user.profilePic)}
              />
              <Box className="credits-text">
                <Text lineHeight="1em" fontSize="xs">
                  {t("HOME.OBSERVED_BY")}
                </Text>
                <div>{featured[slideIndex].observation.user.name}</div>
              </Box>
            </Flex>
          </Link>
        </LocalLink>
        <Indicators size={featured.length} scrollTo={embla?.scrollTo} currentIndex={slideIndex} />
      </div>
    </CarouselContainer>
  );
}
