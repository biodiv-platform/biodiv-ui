import "keen-slider/keen-slider.min.css";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { useKeenSlider } from "keen-slider/react";
import React, { useState } from "react";

import Sidebar from "./sidebar";
import Slide from "./slide";
import SlideInfo from "./slide-info";

export default function CarouselNew({ featured }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, iSlider] = useKeenSlider<HTMLDivElement>(
    {
      loop: featured.length > 1,
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
      <Box gridColumn={{ md: "1/3" }} position="relative">
        <Box ref={sliderRef} className="keen-slider fade">
          {featured.map((o) => (
            <Slide resource={o} key={o.id} />
          ))}
        </Box>
        <SlideInfo
          size={featured.length}
          resource={featured[currentSlide]}
          currentSlide={currentSlide}
          scrollTo={iSlider?.current?.moveToIdx}
        />
      </Box>
      <Sidebar resource={featured[currentSlide]} />
    </SimpleGrid>
  );
}
