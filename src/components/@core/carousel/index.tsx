import styled from "@emotion/styled";
import { RecoIbp } from "@interfaces/observation";
import { useEmblaCarousel } from "embla-carousel/react";
import React, { useEffect, useState } from "react";

import CarouselNavigation from "./navigation";
import CarouselResourceInfo from "./resource-info";
import CarouselSlides from "./slides";
import CarouselThumb from "./thumb";

interface CarouselMainProps {
  resources?;
  reco: RecoIbp;
  speciesGroup?: string;
  observationId?: number;
}

const CarouselContainer = styled.div`
  background: var(--gray-900);
  position: relative;
  border-radius: 0.25rem;
  padding-top: 1.5rem;
  margin-bottom: 1rem;
  overflow: hidden;

  .is-draggable {
    cursor: grab;
  }

  .is-dragging {
    cursor: grabbing;
  }
`;

function CarouselMain({ resources = [], reco, speciesGroup, observationId }: CarouselMainProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const alt = `${reco?.commonName || ""} - ${reco?.scientificName || ""}`;

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("settle", () => {
        setCarouselIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  return (
    <CarouselContainer>
      <CarouselResourceInfo
        observationId={observationId}
        currentResource={resources[carouselIndex]}
      />
      <div ref={emblaRef}>
        <CarouselSlides resources={resources} alt={alt} speciesGroup={speciesGroup} />
      </div>
      <CarouselNavigation carousel={emblaApi} resourcesLength={resources.length} />
      <CarouselThumb resources={resources} carousel={emblaApi} carouselIndex={carouselIndex} />
    </CarouselContainer>
  );
}

export default CarouselMain;
