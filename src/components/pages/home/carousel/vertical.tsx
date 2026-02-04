import {
  Box,
  Button,
  Carousel,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import React from "react";
import { LuArrowDown, LuArrowRight, LuArrowUp } from "react-icons/lu";

import { RESOURCE_SIZE } from "@/static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@/utils/media";

interface VerticalCarouselProps {
  featured: any[];
  slidesPerView: number;
}

export default function VerticalCarousel({ featured, slidesPerView }: VerticalCarouselProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  const visibleSlides = isMobile
    ? 1
    : featured.length > slidesPerView
    ? slidesPerView
    : featured.length;

  const slideHeight = isMobile ? 400 : isTablet ? 150 : 100;

  const showControls = featured.length > slidesPerView || isMobile;

  return (
    <Box mt={8} mb={8} position="relative">
      <Carousel.Root
        orientation="vertical"
        slideCount={featured.length}
        height={`${visibleSlides * slideHeight}px`}
        loop={showControls}
        autoplay
        slidesPerPage={visibleSlides}
      >
        {/* Slides */}
        <Carousel.ItemGroup flex="1">
          {featured.map((resource, index) => {
            const resourceType = resource.authorId
              ? RESOURCE_CTX.OBSERVATION
              : RESOURCE_CTX.USERGROUPS;

            return (
              <Carousel.Item key={index} index={index}>
                <Box
                  h={`${slideHeight}px`}
                  bg={resource.bgColor ?? "var(--chakra-colors-gray-800)"}
                  color={resource.color ?? "white"}
                >
                  {!isMobile ? (
                    <HStack h="full" gap={6}>
                      <Box w={100}>
                        {resource.fileName && (
                          <Image
                            src={getResourceThumbnail(
                              resourceType,
                              resource.fileName,
                              RESOURCE_SIZE.PREVIEW
                            )}
                            h={slideHeight}
                            w={100}
                            objectFit="cover"
                            loading="lazy"
                            alt={resource.id}
                            bg="gray.300"
                          />
                        )}
                      </Box>

                      <Box flex="1" h="full" p={5}>
                        <Center>
                          <Heading fontWeight={500} mb={2} fontSize="1.5rem">
                            {resource.title}
                          </Heading>
                        </Center>
                        <Center>
                          <Text fontSize="sm" maxH={isTablet ? "4rem" : "2rem"} overflow="auto">
                            {resource.customDescripition}
                          </Text>
                        </Center>
                      </Box>

                      {resource.readMoreUIType != "none" && (
                        <Box
                          w={150}
                          display="flex"
                          flexDirection="column"
                          justifyContent="flex-end"
                          alignItems="flex-end"
                          mr={6}
                        >
                          {resource.moreLinks && resource.readMoreUIType === "button" ? (
                            <Button colorPalette="teal" size="lg" fontSize="xl" asChild>
                              <a href={resource.moreLinks}>
                                {resource.readMoreText ?? "Read More"} <LuArrowRight />
                              </a>
                            </Button>
                          ) : (
                            <a href={resource.moreLinks}>
                              <Flex alignItems="center">
                                {resource.readMoreText ?? "Read More"} <LuArrowRight />
                              </Flex>
                            </a>
                          )}
                        </Box>
                      )}
                    </HStack>
                  ) : (
                    <>
                      {resource.fileName && (
                        <Image
                          src={getResourceThumbnail(
                            resourceType,
                            resource.fileName,
                            RESOURCE_SIZE.PREVIEW
                          )}
                          h="192px"
                          w="full"
                          objectFit="cover"
                          loading="lazy"
                          alt={resource.id}
                          bg="gray.300"
                        />
                      )}

                      <Box p={5}>
                        <Center>
                          <Heading fontWeight={500} mb={2} fontSize="1.5rem">
                            {resource.title}
                          </Heading>
                        </Center>
                        <Center>
                          <Text fontSize="sm" maxH="5rem" overflow="auto">
                            {resource.customDescripition}
                          </Text>
                        </Center>
                      </Box>

                      <Flex justify="flex-end" pr={6} pb={2}>
                        {resource.moreLinks && resource.readMoreUIType === "button" ? (
                          <Button colorPalette="teal" size="lg" fontSize="xl" asChild>
                            <a href={resource.moreLinks}>
                              {resource.readMoreText ?? "Read More"} <LuArrowRight />
                            </a>
                          </Button>
                        ) : (
                          <a href={resource.moreLinks}>
                            <Flex alignItems="center">
                              {resource.readMoreText ?? "Read More"} <LuArrowRight />
                            </Flex>
                          </a>
                        )}
                      </Flex>
                    </>
                  )}
                </Box>
              </Carousel.Item>
            );
          })}
        </Carousel.ItemGroup>

        {/* Controls */}
        {showControls && (
          <>
            <Carousel.PrevTrigger asChild>
              <IconButton
                aria-label="Previous slide"
                position="absolute"
                top={-6}
                left="50%"
                transform="translateX(-50%)"
                zIndex={2}
                size="lg"
                colorPalette="gray"
              >
                <LuArrowUp />
              </IconButton>
            </Carousel.PrevTrigger>

            <Carousel.NextTrigger asChild>
              <IconButton
                aria-label="Next slide"
                position="absolute"
                bottom={-6}
                left="50%"
                transform="translateX(-50%)"
                zIndex={2}
                size="lg"
                colorPalette="gray"
              >
                <LuArrowDown />
              </IconButton>
            </Carousel.NextTrigger>
          </>
        )}
      </Carousel.Root>
    </Box>
  );
}
