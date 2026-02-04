import {
  AspectRatio,
  Box,
  Carousel,
  Flex,
  HStack,
  IconButton,
  IconButtonProps
} from "@chakra-ui/react";
import CarouselResourceInfo from "@components/@core/carousel/resource-info";
import Slide, { NoSlide } from "@components/@core/carousel/slide";
import { Thumbnail } from "@components/@core/carousel/thumbnails";
import { ResourceType } from "@interfaces/custom";
import React, { forwardRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import useSpecies from "../use-species";
import SpeciesGalleryModal from "./modal";

export default function SpeciesGallery() {
  const [page, setPage] = useState(0);

  const { species } = useSpecies();
  const [resources, setResources] = useState(
    species?.resourceData?.filter((r) => r.resource.type !== ResourceType.Icon) || []
  );

  const ActionButton = forwardRef<HTMLButtonElement, IconButtonProps>(function ActionButton(
    props,
    ref
  ) {
    return (
      <IconButton
        {...props}
        ref={ref}
        variant="subtle"
        rounded="full"
        position="absolute"
        zIndex="1"
        bg="bg"
        opacity={0.4}
        _hover={{ opacity: 1 }}
      />
    );
  });

  return (
    <Box
      gridColumn={{ md: "2/4" }}
      bg="gray.900"
      borderRadius="md"
      position="relative"
      zIndex={0}
      mb={4}
      p={4}
    >
      <SpeciesGalleryModal resources={resources} setResources={setResources} />
      <CarouselResourceInfo currentResource={resources[page]} />
      <Box minH="438px" alignSelf={"flex-end"}>
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
                      <AspectRatio ratio={16 / 9} minH="438px" w="full">
                        <Slide resource={item.resource} alt={species.taxonomyDefinition.name} />
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
          <NoSlide speciesGroup={species.currentSpeciesGroup} />
        )}
      </Box>
    </Box>
  );
}
