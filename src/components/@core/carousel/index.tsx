import styled from "@emotion/styled";
import { RecoIbp } from "@interfaces/observation";
import EmblaCarouselReact from "embla-carousel-react";
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

  .is-draggable {
    cursor: grab;
  }

  .is-dragging {
    cursor: grabbing;
  }
`;

function CarouselMain({ resources = [], reco, speciesGroup, observationId }: CarouselMainProps) {
  const [carousel, setCarousel] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const alt = `${reco?.commonName || ""} - ${reco?.scientificName || ""}`;

  useEffect(() => {
    if (carousel) {
      carousel.on("select", () => {
        setCarouselIndex(carousel.selectedScrollSnap());
      });
    }
  }, [carousel]);

  return (
    <CarouselContainer>
      <CarouselResourceInfo
        observationId={observationId}
        currentResource={resources[carouselIndex]}
      />
      <EmblaCarouselReact options={{ loop: true }} emblaRef={setCarousel}>
        <CarouselSlides resources={resources} alt={alt} speciesGroup={speciesGroup} />
      </EmblaCarouselReact>
      <CarouselNavigation carousel={carousel} resourcesLength={resources.length} />
      <CarouselThumb resources={resources} carousel={carousel} carouselIndex={carouselIndex} />
    </CarouselContainer>
  );
}

export default CarouselMain;
