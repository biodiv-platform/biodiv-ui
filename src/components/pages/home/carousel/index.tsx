import "keen-slider/keen-slider.min.css";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { useKeenSlider } from "keen-slider/react";
import React from "react";

import Sidebar from "./sidebar";
import Slide from "./slide";
import SlideInfo from "./slide-info";

export default function CarouselNew({ featured }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    }
  });

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
        <Box ref={sliderRef} className="keen-slider">
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
  );
}
