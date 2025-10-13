import "keen-slider/keen-slider.min.css";

import { Box, IconButton, SimpleGrid, useMediaQuery } from "@chakra-ui/react";
import { useKeenSlider } from "keen-slider/react";
import React, { useState } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import Sidebar from "./sidebar";
import Slide from "./slide";
import SlideInfo from "./slide-info";

export default function CarouselNew({ featured, mini, slidesPerView = 1 }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderLoaded, setSliderLoaded] = useState(false);
  const [isBig] = useMediaQuery(["(min-width: 1100px)"]);
  const [isMedium] = useMediaQuery(["(min-width: 768px) and (max-width: 1099px)"]);

  const [sliderRef, iSlider] = useKeenSlider<HTMLDivElement>(
    {
      loop: !isBig || featured.length > slidesPerView || isMedium && featured.length > 2,
      slides: {
        perView: 1
      },
      breakpoints: {
        "(min-width: 1100px)": {
          slides: {
            perView: slidesPerView,
            spacing: 16
          }
        },
        ...(featured.length>2 && slidesPerView>1 && {
          "(min-width: 768px) and (max-width: 1099px)": {
            slides: {
              perView: 2,
              spacing: 10
            }
          }
        })
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
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      borderRadius="md"
      overflow="hidden"
      mb={10}
      bg={mini ? "white" : "gray.300"}
      {...(mini && { mt: 8, mb: 8 })}
    >
      <Box gridColumn={{ md: mini ? "1/4" : "1/3" }} position="relative">
        {mini && (!isBig || featured.length > slidesPerView || (isMedium && featured.length > 2)) && (
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
        <Box
          ref={sliderRef}
          className="keen-slider fade"
          style={{ visibility: sliderLoaded ? "visible" : "hidden" }}
        >
          {featured.map((o) => (
            <>
              <Slide resource={o} key={o.id} mini={mini} />
            </>
          ))}
        </Box>
        {mini && (!isBig || featured.length > slidesPerView || (isMedium && featured.length > 2)) && (
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
            resource={featured[currentSlide]}
            currentSlide={currentSlide}
            scrollTo={iSlider?.current?.moveToIdx}
            mini={mini}
          />
        )}
      </Box>
      {!mini && <Sidebar resource={featured[currentSlide]} />}
    </SimpleGrid>
  );
}
