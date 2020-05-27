import { Icon } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { ResourceType } from "@interfaces/custom";
import { RESOURCE_SIZE } from "@static/constants";
import { getObservationImage, getYoutubeImage } from "@utils/media";
import React from "react";
import LazyImage from "react-cool-img";

const ThumbBox = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  ul {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    li {
      cursor: pointer;
      border: 2px solid transparent;
      opacity: 0.8;
      margin: 0.25rem;
      border-radius: 0.25rem;
      overflow: hidden;
      background: var(--gray-300);

      &.active {
        opacity: 1;
        border-color: var(--gray-300);
      }

      &:hover {
        opacity: 1;
      }

      .carousel--audio-thumb,
      img {
        width: 2.2rem;
        height: 2.2rem;
        object-fit: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--white);
      }
    }
  }
`;

function CarouselThumb({ resources, carousel, carouselIndex }) {
  const getThumbnail = (resource) => {
    switch (resource.type) {
      case ResourceType.Image:
        return (
          <LazyImage
            loading="lazy"
            alt={resource.description || resource.fileName}
            src={getObservationImage(resource.fileName, RESOURCE_SIZE.THUMBNAIL)}
          />
        );

      case ResourceType.Video:
        return resource?.url ? (
          <LazyImage
            alt={resource.description || resource.fileName}
            src={getYoutubeImage(resource.url, "default")}
          />
        ) : (
          <div className="carousel--audio-thumb">
            <Icon name="ibpvideo" />
          </div>
        );

      case ResourceType.Audio:
        return (
          <div className="carousel--audio-thumb">
            <Icon name="ibpaudio" />
          </div>
        );

      default:
        return <>_</>;
    }
  };

  return (
    <ThumbBox>
      <ul>
        {resources.map(({ resource }, index) => (
          <li
            key={resource.id}
            className={carouselIndex === index ? "active" : "inactive"}
            onClick={() => carousel.scrollTo(index)}
          >
            {getThumbnail(resource)}
          </li>
        ))}
      </ul>
    </ThumbBox>
  );
}

export default CarouselThumb;
