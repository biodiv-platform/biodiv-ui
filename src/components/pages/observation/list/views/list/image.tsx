import { HStack } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import ShadowedUser from "@components/pages/common/shadowed-user";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import styled from "@emotion/styled";
import { Role } from "@interfaces/custom";
import { ObservationListPageMapper } from "@interfaces/observation";
import { RESOURCE_SIZE } from "@static/constants";
import { adminOrAuthor, hasAccess } from "@utils/auth";
import { getLocalIcon, getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import { Mq } from "mq-styled-components";
import React, { useEffect } from "react";
import { useState } from "react";
import { LuAudioLines, LuImage, LuVideo } from "react-icons/lu";

import { ImageWithFallback } from "@/components/@core/image-with-fallback";
import { Checkbox } from "@/components/ui/checkbox";

const ImageBox = styled.div`
  position: relative;
  height: auto;
  border-right: 1px solid var(--chakra-colors-gray-300);
  flex-shrink: 0;

  .ob-image-list {
    width: 18rem;
    height: 18rem;
  }

  .topBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .topCheckbox {
    border-radius: 5rem;
    background: white;
    margin: 10px;
    box-shadow: var(--subtle-shadow);
  }
  .stats {
    user-select: none;
    margin: 0.5rem;
    padding: 0.1rem 0.6rem;
    border-radius: 1rem;
    background: white;
    box-shadow: var(--subtle-shadow);

    svg {
      display: inline-block;

      margin-top: 0.25rem;
      margin-right: 0.7rem;

      vertical-align: top;

      &:last-child {
        margin-right: 0.25rem;
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

export interface ObservationImageCard {
  o: ObservationListPageMapper;
  getCheckboxProps?: (props?: any | undefined) => {
    [x: string]: any;
  };
}
export default function ImageBoxComponent({ o, getCheckboxProps }: ObservationImageCard) {
  const [canEdit, setCanEdit] = useState(false);
  const {
    hasUgAccess,
    setCropObservationId,
    selectAll,
    setExcludedBulkIds,
    bulkSpeciesIds,
    setBulkSpeciesIds
  } = useObservationFilter();

  useEffect(() => {
    setCanEdit(hasAccess([Role.Admin]) || hasUgAccess || false);
  }, [hasUgAccess]);

  const handleImageIconClick = () => {
    const canCrop = adminOrAuthor(o.user?.id);
    setCropObservationId(o.observationId, canCrop);
  };

  return (
    <ImageBox>
      <HStack className="topBox" justifyContent="space-between">
        <div className="stats" onClick={handleImageIconClick}>
          {o.noOfImages ? (
            <>
              {o.noOfImages}
              <LuImage />
            </>
          ) : null}
          {o.noOfVideos ? (
            <>
              {o.noOfVideos} <LuVideo />
            </>
          ) : null}
          {o.noOfAudios ? (
            <>
              {o.noOfAudios} <LuAudioLines />
            </>
          ) : null}
        </div>
        {canEdit && getCheckboxProps && (
          <Checkbox
            {...getCheckboxProps({ value: String(o.observationId) })}
            className="topCheckbox"
            colorPalette={"blue"}
            onChange={(e) => {
              if (selectAll) {
                if (!e.target["checked"]) {
                  // Add to excludedIDs if unchecked
                  if (o.speciesGroupId !== undefined) {
                    bulkSpeciesIds[o.speciesGroupId] = bulkSpeciesIds[o.speciesGroupId] - 1;
                    setBulkSpeciesIds(bulkSpeciesIds);
                  }
                  setExcludedBulkIds((prev) => [...prev, String(o.observationId)]);
                } else {
                  // Remove from excludedIDs if checked
                  if (o.speciesGroupId !== undefined) {
                    bulkSpeciesIds[o.speciesGroupId] = bulkSpeciesIds[o.speciesGroupId] + 1;
                    setBulkSpeciesIds(bulkSpeciesIds);
                  }
                  setExcludedBulkIds((prev) => prev.filter((id) => id !== String(o.observationId)));
                }
              } else {
                if (e.target["checked"]) {
                  if (o.speciesGroupId !== undefined) {
                    bulkSpeciesIds[o.speciesGroupId] = (bulkSpeciesIds[o.speciesGroupId] || 0) + 1;
                    setBulkSpeciesIds(bulkSpeciesIds);
                  }
                } else {
                  if (o.speciesGroupId !== undefined) {
                    bulkSpeciesIds[o.speciesGroupId] = bulkSpeciesIds[o.speciesGroupId] - 1;
                    setBulkSpeciesIds(bulkSpeciesIds);
                  }
                }
              }
            }}
          ></Checkbox>
        )}
      </HStack>

      <LocalLink href={`/observation/show/${o.observationId}`} prefixGroup={true}>
        <ImageWithFallback
          className="ob-image-list"
          objectFit="cover"
          bg="gray.100"
          src={getResourceThumbnail(
            RESOURCE_CTX.OBSERVATION,
            o.reprImageUrl,
            RESOURCE_SIZE.LIST_THUMBNAIL
          )}
          fallbackSrc={getLocalIcon(o?.speciesGroup)}
          alt={o.observationId?.toString()}
        />
      </LocalLink>

      <ShadowedUser user={o.user} />
    </ImageBox>
  );
}
