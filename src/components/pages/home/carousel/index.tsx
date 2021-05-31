import { Box, SimpleGrid } from "@chakra-ui/react";
import { useKeenSlider } from "keen-slider/react";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";

import Sidebar from "./sidebar";
import Slide from "./slide";
import SlideInfo from "./slide-info";

export default function CarouselNew({ featured }) {
  const [pause, setPause] = useState(false);
  const timer = useRef<any>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged: (s) => setCurrentSlide(s.details().relativeSlide),
    duration: 1000, // transition duration when slide changes
    dragStart: () => setPause(true),
    dragEnd: () => setPause(false)
  });

  useEffect(() => {
    sliderRef?.current?.addEventListener("mouseover", () => setPause(true));
    sliderRef?.current?.addEventListener("mouseout", () => setPause(false));
  }, [sliderRef]);

  /*
   * This will be called every 4s to change slide to next
   * unless if you are hovering over slide and next call will be skipped
   */
  useEffect(() => {
    timer.current = setInterval(() => {
      if (!pause && slider) {
        slider.next();
      }
    }, 4000);
    return () => {
      clearInterval(timer.current);
    };
  }, [pause, slider]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/keen-slider/keen-slider.min.css"
          key="keen-slider"
        />
      </Head>
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
            scrollTo={slider?.moveToSlide}
          />
        </Box>
        <Sidebar resource={featured[currentSlide]} />
      </SimpleGrid>
    </>
  );
}
