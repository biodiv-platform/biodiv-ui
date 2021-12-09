import { Box, Flex } from "@chakra-ui/react";
import CarouselNavigation from "@components/@core/carousel/navigation";
import CarouselResourceInfo from "@components/@core/carousel/resource-info";
import Slide, { NoSlide } from "@components/@core/carousel/slide";
import Thumbnails from "@components/@core/carousel/thumbnails";
import { ResourceType } from "@interfaces/custom";
import { useKeenSlider } from "keen-slider/react";
import Head from "next/head";
import React, { useState } from "react";

import useSpecies from "../use-species";
import SpeciesGalleryModal from "./modal";

export default function SpeciesGallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { species } = useSpecies();
  const [resources, setResources] = useState(
    species?.resourceData?.filter((r) => r.resource.type !== ResourceType.Icon) || []
  );

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: false,
    slideChanged: (s) => setCurrentSlide(s?.track?.details?.rel)
  });

  return (
    <Box gridColumn={{ md: "2/4" }} className="fadeInUp delay-3">
      <Box bg="gray.900" borderRadius="md" position="relative" zIndex={0} mb={4} p={4}>
        <SpeciesGalleryModal resources={resources} setResources={setResources} />
        <CarouselResourceInfo currentResource={resources[currentSlide]} />
        <Head>
          <link
            rel="stylesheet"
            href="https://unpkg.com/keen-slider/keen-slider.min.css"
            key="keen-slider"
          />
        </Head>
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
                <Slide resource={resource} alt={species.taxonomyDefinition.normalizedForm} />
              </Flex>
            ))
          ) : (
            <NoSlide speciesGroup={species.currentSpeciesGroup} />
          )}
        </Box>
        {resources?.length && (
          <>
            <CarouselNavigation
              prev={slider?.current?.prev}
              next={slider?.current?.next}
              current={currentSlide}
              total={resources.length}
            />
            <Thumbnails
              resources={resources}
              moveTo={slider?.current?.moveToIdx}
              current={currentSlide}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
