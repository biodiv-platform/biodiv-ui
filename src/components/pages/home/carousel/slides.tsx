import { Avatar, Box, Flex, Image, Link, Text } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import { GallerySlider } from "@interfaces/utility";
import { HERO_FALLBACK } from "@static/home";
import { getObservationThumbnail, getUserImage } from "@utils/media";
import { useEmblaCarousel } from "embla-carousel/react";
import { Mq } from "mq-styled-components";
import React, { useEffect } from "react";

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
  featured: GallerySlider[];
  slideIndex;
  onChange;
}

export default function Slides({ featured, slideIndex, onChange }: ISlidesProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const { t } = useTranslation();

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("settle", () => {
        onChange(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  return (
    <CarouselContainer>
      <div ref={emblaRef}>
        <div className="carousel">
          {featured.map((o) => (
            <LocalLink key={o.id} href={`/observation/show/${o.observationId}`} prefixGroup={true}>
              <a>
                <Image
                  objectFit="cover"
                  loading="lazy"
                  src={getObservationThumbnail(o?.fileName, 500)}
                  alt={o.observationId?.toString()}
                  fallbackSrc={HERO_FALLBACK}
                />
              </a>
            </LocalLink>
          ))}
        </div>
      </div>
      <div className="slide-content">
        {featured[slideIndex].authorId && (
          <LocalLink href={`/user/show/${featured[slideIndex].authorId}`}>
            <Link>
              <Flex alignItems="center">
                <Avatar
                  mr={2}
                  flexShrink={0}
                  size="sm"
                  name={featured[slideIndex].authorName}
                  src={getUserImage(featured[slideIndex].authorImage)}
                />
                <Box className="credits-text">
                  <Text lineHeight="1em" fontSize="xs">
                    {t("HOME.OBSERVED_BY")}
                  </Text>
                  <div>{featured[slideIndex].authorName}</div>
                </Box>
              </Flex>
            </Link>
          </LocalLink>
        )}
        <Indicators
          size={featured.length}
          scrollTo={emblaApi?.scrollTo}
          currentIndex={slideIndex}
        />
      </div>
    </CarouselContainer>
  );
}
