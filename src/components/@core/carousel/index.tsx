import { Box, Flex } from "@chakra-ui/react";
import { RecoIbp } from "@interfaces/observation";
import { useKeenSlider } from "keen-slider/react";
import Head from "next/head";
import React from "react";

import CarouselNavigation from "./navigation";
import CarouselResourceInfo from "./resource-info";
import Slide, { NoSlide } from "./slide";
import Thumbnails from "./thumbnails";

interface CarouselObservationProps {
  resources?;
  reco: RecoIbp | undefined;
  speciesGroup?: string;
  observationId?: number;
}

export default function CarouselObservation({
  resources = [],
  reco,
  speciesGroup,
  observationId
}: CarouselObservationProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const alt = `${reco?.commonName || ""} - ${reco?.scientificName || ""}`;

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    }
  });

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/keen-slider/keen-slider.min.css"
          key="keen-slider"
        />
      </Head>
      <Box bg="gray.900" borderRadius="md" position="relative" mb={4} p={4}>
        <CarouselResourceInfo
          observationId={observationId}
          currentResource={resources[currentSlide]}
        />
        <Box ref={sliderRef} className="keen-slider fade" h="438px">
          {resources.length ? (
            resources.map(({ resource }) => (
              <Flex
                key={resource.id}
                className="keen-slider__slide"
                minW="100%"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <Slide resource={resource} alt={alt} />
              </Flex>
            ))
          ) : (
            <NoSlide speciesGroup={speciesGroup} />
          )}
        </Box>
        {resources.length && (
          <>
            <CarouselNavigation
              prev={slider?.prev}
              next={slider?.next}
              current={currentSlide}
              total={resources.length}
            />
            <Thumbnails
              resources={resources}
              moveTo={slider?.moveToSlideRelative}
              current={currentSlide}
            />
          </>
        )}
      </Box>
    </>
  );
}
