import { Box, Image, Link } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { ResourceType } from "@interfaces/custom";
import { RESOURCE_SIZE } from "@static/constants";
import {
  getFallbackSpinner,
  getObservationImage,
  getObservationRAW,
  getSpeciesIcon,
  getYouTubeEmbed
} from "@utils/media";
import React from "react";

const fallbackSpinner = getFallbackSpinner();

const CarouselBox = styled.div`
  display: flex;
  position: relative;
  & > div {
    height: 442px;
    flex: 0 0 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .carousel--description {
      position: absolute;
      bottom: 0;
      width: 100%;
      color: white;
      text-align: center;
      padding: 1rem;
      background: linear-gradient(to bottom, rgba(25, 25, 35, 0), rgba(25, 25, 35, 1));
    }
    .carousel--image,
    a {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
      position: relative;
    }
    iframe {
      max-width: 100%;
    }
    .carousel--audio {
      width: 50%;
    }
  }
`;

function CarouselSlides({ resources, alt, speciesGroup }) {
  const getSlide = (resource) => {
    switch (resource.type) {
      case ResourceType.Image:
        return (
          <Link target="_blank" href={getObservationRAW(resource.fileName)}>
            <Image
              className="carousel--image"
              loading="lazy"
              ignoreFallback={true}
              src={getObservationImage(resource.fileName, RESOURCE_SIZE.PREVIEW)}
              placeholder={fallbackSpinner}
              alt={resource.description || alt || resource.fileName}
            />
            {resource.description && (
              <Box className="carousel--description">{resource.description}</Box>
            )}
          </Link>
        );

      case ResourceType.Video:
        return resource.url ? (
          <iframe
            width="500"
            height="300"
            src={getYouTubeEmbed(resource.url)}
            frameBorder={0}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
          ></iframe>
        ) : (
          <video width="500" height="300" controls>
            <source src={getObservationRAW(resource.fileName)} />
          </video>
        );

      case ResourceType.Audio:
        return (
          <audio
            src={getObservationRAW(resource.fileName)}
            preload="auto"
            controls={true}
            className="carousel--audio"
          ></audio>
        );

      default:
        return <>_</>;
    }
  };

  return (
    <CarouselBox>
      {resources.length ? (
        resources.map(({ resource }) => <div key={resource.id}>{getSlide(resource)}</div>)
      ) : (
        <Box color="gray.500">
          <Image maxW="20rem" boxSize="full" src={getSpeciesIcon(speciesGroup)} />
        </Box>
      )}
    </CarouselBox>
  );
}

export default CarouselSlides;
