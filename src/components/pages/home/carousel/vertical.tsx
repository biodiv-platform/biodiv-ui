import "keen-slider/keen-slider.min.css";

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useBreakpointValue
} from "@chakra-ui/react";
import { useKeenSlider } from "keen-slider/react";
import React, { useState } from "react";
import { LuArrowDown, LuArrowRight, LuArrowUp } from "react-icons/lu";

import { RESOURCE_SIZE } from "@/static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@/utils/media";

export default function VerticalCarousel({ featured, slidesPerView }) {
  const [, setCurrentSlide] = useState(0);
  const [sliderLoaded, setSliderLoaded] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  const [sliderRef, iSlider] = useKeenSlider<HTMLDivElement>(
    {
      vertical: true,
      loop: featured.length > slidesPerView || isMobile,
      slides: {
        perView: isMobile ? 1 : featured.length > slidesPerView ? slidesPerView : featured.length,
        spacing: 4
      },
      slideChanged: (s) => setCurrentSlide(s?.track?.details?.rel),
      created: () => setSliderLoaded(true)
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 7000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      }
    ]
  );

  return (
    <Box position={"relative"} mt={8} mb={8}>
      {(featured.length > slidesPerView || isMobile) && (
        <IconButton
          aria-label="Prev Slide"
          onClick={() => iSlider.current?.prev()}
          position="absolute"
          top={-7}
          left={"50%"}
          transform="translateX(-50%)"
          zIndex={1}
          colorPalette="gray"
          size="lg"
        >
          <LuArrowUp size={12} color="white" />
        </IconButton>
      )}
      <Box
        ref={sliderRef}
        className="keen-slider"
        style={{ visibility: sliderLoaded ? "visible" : "hidden" }}
        h={
          isMobile
            ? 400
            : featured.length > slidesPerView
            ? (isTablet ? 150 : 100) * slidesPerView
            : (isTablet ? 150 : 100) * featured.length
        }
      >
        {featured.map((o, index) => {
          const resource = o;
          const resourceType = resource.authorId
            ? RESOURCE_CTX.OBSERVATION
            : RESOURCE_CTX.USERGROUPS;
          return (
            <Box
              key={index}
              className="keen-slider__slide"
              bg={resource.bgColor ? resource.bgColor : "var(--chakra-colors-gray-800)"}
              color={resource.color ? resource.color : "white"}
            >
              {!isMobile && (
                <HStack h="full" gap={6}>
                  <Box w={100}>
                    {resource.fileName && (
                      <Image
                        src={getResourceThumbnail(
                          resourceType,
                          resource?.fileName,
                          RESOURCE_SIZE.PREVIEW
                        )}
                        h={isTablet ? 150 : 100}
                        w={100}
                        objectFit="cover"
                        loading="lazy"
                        alt={resource.id}
                        bg="gray.300"
                      />
                    )}
                  </Box>
                  <Box flex="1" h="full" p={{ base: 5 }}>
                    <>
                      <Center>
                        <Heading as="h1" fontWeight={500} mb={2} fontSize="1.5rem">
                          {resource?.title}
                        </Heading>
                      </Center>
                      <Center>
                        <Text fontSize={"sm"} maxH={isTablet ? "4rem" : "2rem"} overflow={"auto"}>
                          {resource?.customDescripition}
                        </Text>
                      </Center>
                    </>
                  </Box>
                  <Box
                    width={150}
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    mr={6}
                  >
                    {resource.moreLinks && resource.readMoreUIType == "button" ? (
                      <Button colorPalette="teal" variant="solid" size="lg" fontSize="xl" asChild>
                        <a href={resource.moreLinks}>
                          {resource.readMoreText == null ? "Read More" : resource.readMoreText}{" "}
                          <LuArrowRight />
                        </a>
                      </Button>
                    ) : (
                      <a href={resource.moreLinks}>
                        <Flex alignItems="center">
                          {resource.readMoreText == null ? "Read More" : resource.readMoreText}{" "}
                          <LuArrowRight />
                        </Flex>
                      </a>
                    )}
                  </Box>
                </HStack>
              )}
              {isMobile && (
                <Box>
                  {resource.fileName && (
                    <Image
                      src={getResourceThumbnail(
                        resourceType,
                        resource?.fileName,
                        RESOURCE_SIZE.PREVIEW
                      )}
                      h={"192px"}
                      w={"full"}
                      objectFit="cover"
                      loading="lazy"
                      alt={resource.id}
                      bg="gray.300"
                    />
                  )}
                  <Box flex="1" h={"9.5rem"} p={{ base: 5 }}>
                    <>
                      <Center>
                        <Heading as="h1" fontWeight={500} mb={2} fontSize="1.5rem">
                          {resource?.title}
                        </Heading>
                      </Center>
                      <Center>
                        <Text fontSize={"sm"} mb={4} maxH="5rem" overflow="auto">
                          {resource?.customDescripition}
                        </Text>
                      </Center>
                    </>
                  </Box>
                  <Box
                    width={"full"}
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    mb={2}
                  >
                    <Box mr={6}>
                      {resource.moreLinks && resource.readMoreUIType == "button" ? (
                        <Button colorPalette="teal" variant="solid" size="lg" fontSize="xl" asChild>
                          <a href={resource.moreLinks}>
                            {resource.readMoreText == null ? "Read More" : resource.readMoreText}{" "}
                            <LuArrowRight />
                          </a>
                        </Button>
                      ) : (
                        <a href={resource.moreLinks}>
                          <Flex alignItems="center">
                            {resource.readMoreText == null ? "Read More" : resource.readMoreText}{" "}
                            <LuArrowRight />
                          </Flex>
                        </a>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      {(featured.length > slidesPerView || isMobile) && (
        <IconButton
          aria-label="Next Slide"
          onClick={() => iSlider.current?.next()}
          position="absolute"
          bottom={-5}
          left={"50%"}
          transform="translateX(-50%)"
          zIndex={1}
          colorPalette="gray"
          size="lg"
        >
          <LuArrowDown size={12} color="white" />
        </IconButton>
      )}
    </Box>
  );
}
