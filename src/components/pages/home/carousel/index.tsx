import "keen-slider/keen-slider.min.css";

import { Box, IconButton, SimpleGrid } from "@chakra-ui/react";
import { LANG } from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { useKeenSlider } from "keen-slider/react";
import React, { useState } from "react";
import { LuArrowLeft } from "react-icons/lu";

import Sidebar from "./sidebar";
import Slide from "./slide";
import SlideInfo from "./slide-info";

export default function CarouselNew({ featured, mini, slidesPerView = 1 }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { languageId } = useGlobalState();

  const [sliderRef, iSlider] = useKeenSlider<HTMLDivElement>(
    {
      //vertical: vertical,
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

  return (
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      borderRadius="md"
      overflow="hidden"
      mb={10}
      bg="gray.300"
      color="white"
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
  );
}
