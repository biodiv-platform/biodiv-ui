import {
  AspectRatio,
  Box,
  Carousel,
  Flex,
  HStack,
  IconButton,
  IconButtonProps
} from "@chakra-ui/react";
import { RecoIbp } from "@interfaces/observation";
import React, { forwardRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import CarouselResourceInfo from "./resource-info";
import Slide, { NoSlide } from "./slide";
import { Thumbnail } from "./thumbnails";

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
  const [page, setPage] = useState(0);

  const ActionButton = forwardRef<HTMLButtonElement, IconButtonProps>(function ActionButton(
    props,
    ref
  ) {
    return (
      <IconButton
        {...props}
        ref={ref}
        size="xs"
        variant="outline"
        rounded="full"
        position="absolute"
        zIndex="1"
        bg="bg"
      />
    );
  });

  const alt = `${reco?.commonName || ""} - ${reco?.scientificName || ""}`;

  return (
    <Box bg="gray.900" borderRadius="md" position="relative" mb={4} p={4}>
      <CarouselResourceInfo observationId={observationId} currentResource={resources[page]} />
      <Box minH="438px" alignContent={"center"}>
        {resources.length ? (
          <Carousel.Root
            slideCount={resources.length}
            gap="4"
            mx="auto"
            maxW="3xl"
            position="relative"
            onPageChange={(e) => setPage(e.page)}
            slidesPerPage={1}
          >
            <Carousel.Control gap="4" width="full" alignItems="center" justifyContent="center">
              <Carousel.PrevTrigger asChild>
                <ActionButton insetStart="-2">
                  <LuChevronLeft />
                </ActionButton>
              </Carousel.PrevTrigger>

              <Carousel.ItemGroup width="full">
                {resources.map((item, index) => (
                  <Carousel.Item key={index} index={index}>
                    <Flex
                      key={index}
                      minW="100%"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                    >
                      <AspectRatio ratio={16 / 9} maxH="72vh" w="full">
                        <Slide resource={item.resource} alt={alt} />
                      </AspectRatio>
                    </Flex>
                  </Carousel.Item>
                ))}
              </Carousel.ItemGroup>

              <Carousel.NextTrigger asChild>
                <ActionButton insetEnd="-2">
                  <LuChevronRight />
                </ActionButton>
              </Carousel.NextTrigger>
            </Carousel.Control>

            <Carousel.IndicatorGroup>
              <HStack justifyContent="center" gap={2} maxW="full" overflowY="auto">
                {resources.map((item, index) => (
                  <Carousel.Indicator
                    key={index}
                    index={index}
                    unstyled
                    _current={{
                      outline: "2px solid currentColor",
                      outlineOffset: "2px"
                    }}
                    cursor="pointer"
                    transition="all 250ms"
                    boxSize="2.5rem"
                    minW="2.5rem"
                    border="2px"
                    borderRadius="md"
                    borderColor="transparent"
                    bg="gray.300"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                    opacity={index === page ? 1 : 0.7}
                    _hover={{ opacity: 1 }}
                  >
                    <Thumbnail resource={item.resource} />
                  </Carousel.Indicator>
                ))}
              </HStack>
            </Carousel.IndicatorGroup>
          </Carousel.Root>
        ) : (
          <NoSlide speciesGroup={speciesGroup} />
        )}
      </Box>
    </Box>
  );
}
