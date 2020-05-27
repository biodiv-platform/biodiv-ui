import { Icon, Image, Link } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import styled from "@emotion/styled";
import { ObservationListPageMapper } from "@interfaces/observation";
import { RESOURCE_SIZE } from "@static/constants";
import { getObservationImage, getSpeciesIcon } from "@utils/media";
import { Mq } from "mq-styled-components";
import React from "react";

import ShadowedUser from "../shared/shadowed-user";

const ImageBox = styled.div`
  position: relative;
  height: auto;
  border-right: 1px solid var(--gray-300);
  flex-shrink: 0;

  .ob-image-list {
    width: 18rem;
    height: 18rem;
  }

  .stats {
    position: absolute;
    top: 0;
    left: 0;

    margin: 1rem;
    padding: 0.1rem 0.6rem;

    user-select: none;

    border-radius: 1rem;
    background: white;
    box-shadow: var(--subtle-shadow);

    svg {
      display: inline-block;

      margin-top: 0.25rem;
      margin-right: 0.35rem;
      margin-left: -0.2rem;

      vertical-align: top;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  @media (max-width: 767px) {
    border-right: 0;
    .ob-image-list {
      width: 100%;
    }
  }

  ${Mq.min.md + " and (max-width: 1024px)"} {
    .ob-image-list {
      width: 14rem;
    }
  }
`;

export default function ImageBoxComponent({ o }: { o: ObservationListPageMapper }) {
  return (
    <ImageBox>
      <div className="stats">
        {o.noOfImages > 0 && (
          <>
            {o.noOfImages} <Icon name="ibpimage" />
          </>
        )}
        {o.noOfVideos > 0 && (
          <>
            {o.noOfVideos} <Icon name="ibpvideo" />
          </>
        )}
        {o.noOfAudios > 0 && (
          <>
            {o.noOfAudios} <Icon name="ibpaudio" />
          </>
        )}
      </div>

      <LocalLink href={`/observation/show/${o.observationId}`} prefixGroup={true}>
        <Link color="white">
          <Image
            className="ob-image-list"
            objectFit="cover"
            bg="gray.100"
            src={getObservationImage(o.reprImageUrl, RESOURCE_SIZE.LIST_THUMBNAIL)}
            fallbackSrc={getSpeciesIcon(o?.speciesGroup)}
            alt={o.observationId.toString()}
          />
        </Link>
      </LocalLink>

      <ShadowedUser user={o.user} />
    </ImageBox>
  );
}
