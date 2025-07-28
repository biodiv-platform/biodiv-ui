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
  SimpleGrid,
  Text
} from "@chakra-ui/react";
import { LANG } from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { useKeenSlider } from "keen-slider/react";
import React, { useState } from "react";
import { LuArrowDown, LuArrowLeft, LuArrowRight, LuArrowUp } from "react-icons/lu";

import { RESOURCE_SIZE } from "@/static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@/utils/media";

import Sidebar from "./sidebar";
import Slide from "./slide";
import SlideInfo from "./slide-info";

export default function CarouselNew({ featured, mini, slidesPerView = 1, vertical = false }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { languageId } = useGlobalState();

  const [sliderRef, iSlider] = useKeenSlider<HTMLDivElement>(
    {
      vertical: vertical,
      loop: featured.length > slidesPerView,
      slides: {
        //!vertical?
        perView: slidesPerView,
        //: featured.length > slidesPerView
        //? slidesPerView
        //: featured.length,
        spacing: 16
      },
      slideChanged: (s) => setCurrentSlide(s?.track?.details?.rel)
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

  return !vertical ? (
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      borderRadius="md"
      overflow="hidden"
      mb={10}
      bg="gray.300"
      color="white"
      {...(mini && { mt: 8, mb: 8 })}
    >
      <Box gridColumn={{ md: mini ? "1/4" : "1/3" }} position="relative">
        {mini && (
          <IconButton
            aria-label="Next Slide"
            onClick={() => iSlider.current?.prev()}
            position="absolute"
            top={"40%"}
            zIndex={1}
            colorPalette="gray"
            size="lg"
          >
            <LuArrowLeft size={12} color={"white"} />
          </IconButton>
        )}
        <Box ref={sliderRef} className="keen-slider fade">
          {featured.map((o) => (
            <>
              <Slide
                resource={o[1]?.[languageId]?.[0] || o[1]?.[LANG.DEFAULT_ID]?.[0]}
                key={o.id}
                mini={mini}
              />
            </>
          ))}
        </Box>
        {mini && (
          <IconButton
            aria-label="Next Slide"
            onClick={() => iSlider.current?.next()}
            position="absolute"
            top={"40%"}
            zIndex={1}
            colorPalette="gray"
            right={0}
            size="lg"
          >
            <LuArrowRight size={12} color={"white"} />
          </IconButton>
        )}
        {!mini && (
          <SlideInfo
            size={featured.length}
            resource={
              featured[currentSlide][1]?.[languageId]?.[0] ||
              featured[currentSlide][1]?.[LANG.DEFAULT_ID]?.[0]
            }
            currentSlide={currentSlide}
            scrollTo={iSlider?.current?.moveToIdx}
            mini={mini}
          />
        )}
      </Box>
      {!mini && (
        <Sidebar
          resource={
            featured[currentSlide][1]?.[languageId]?.[0] ||
            featured[currentSlide][1]?.[LANG.DEFAULT_ID]?.[0]
          }
        />
      )}
    </SimpleGrid>
  ) : (
    <Box position={"relative"} mt={8} mb={8}>
      <IconButton
        aria-label="Prev Slide"
        onClick={() => iSlider.current?.prev()}
        position="absolute"
        top={-7}
        left={"50%"}
        zIndex={1}
        colorPalette="gray"
        size="lg"
      >
        <LuArrowUp size={12} color="white" />
      </IconButton>
      <Box
        ref={sliderRef}
        className="keen-slider"
        height={featured.length > slidesPerView ? 200 * slidesPerView : 200 * featured.length}
      >
        {featured.map((o, index) => {
          const resource = o[1]?.[languageId]?.[0] || o[1]?.[LANG.DEFAULT_ID]?.[0];
          const resourceType = resource.authorId
            ? RESOURCE_CTX.OBSERVATION
            : RESOURCE_CTX.USERGROUPS;
          return (
            <Box
              key={index}
              className="keen-slider__slide"
              bg="var(--chakra-colors-gray-800)"
              color="white"
            >
              <HStack h="full" gap={6}>
                <Image
                  src={getResourceThumbnail(
                    resourceType,
                    resource?.fileName,
                    RESOURCE_SIZE.PREVIEW
                  )}
                  h={200}
                  w={200}
                  objectFit="cover"
                  loading="lazy"
                  alt={resource.id}
                  bg="gray.300"
                />
                <Center flex="1" h="full" p={{ base: 5 }}>
                  <Box>
                    <Heading as="h1" fontWeight={500} mb={2} fontSize="1.2rem">
                      {resource?.title}
                    </Heading>
                    <Text fontSize={"sm"} mb={4} maxH="6rem" overflow="auto">
                      {resource?.customDescripition}
                    </Text>
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
                </Center>
              </HStack>
            </Box>
          );
        })}
      </Box>
      <IconButton
        aria-label="Next Slide"
        onClick={() => iSlider.current?.next()}
        position="absolute"
        bottom={-5}
        left={"50%"}
        zIndex={1}
        colorPalette="gray"
        size="lg"
      >
        <LuArrowDown size={12} color="white" />
      </IconButton>
    </Box>
  );
}
