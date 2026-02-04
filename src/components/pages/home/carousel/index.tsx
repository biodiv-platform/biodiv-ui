import { Box, Carousel, IconButton, SimpleGrid, useMediaQuery } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import Sidebar from "./sidebar";
import Slide from "./slide";
import SlideInfo from "./slide-info";

export default function CarouselNew({ featured, mini, slidesPerView = 1 }) {
  const [page, setPage] = useState(0);

  const [isBig] = useMediaQuery(["(min-width: 1100px)"]);
  const [isMedium] = useMediaQuery(["(min-width: 768px) and (max-width: 1099px)"]);

  const slidesPerPage = useMemo(() => {
    if (isBig) return slidesPerView;

    if (isMedium && featured.length > 2 && slidesPerView > 1) {
      return 2;
    }

    return 1;
  }, [isBig, isMedium, slidesPerView, featured.length]);

  const gapResponsive = {
    base: 4,
    md: featured.length > 2 && slidesPerView > 1 ? 2.5 : 4,
    lg: 4
  };

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
            onClick={() => setPage(page > 0 ? page - 1 : featured.length - 1)}
            position="absolute"
            top={"40%"}
            zIndex={1}
            colorPalette="gray"
            size="lg"
          >
            <LuArrowLeft size={12} color={"white"} />
          </IconButton>
        )}
        <Carousel.Root
          slideCount={featured.length}
          mx="auto"
          gap={gapResponsive}
          position="relative"
          colorPalette="white"
          autoplay={{ delay: 5000 }}
          page={page}
          onPageChange={(e) => setPage(e.page)}
          slidesPerPage={slidesPerPage}
        >
          <Carousel.Control gap="4" width="full" position="relative">
            <Carousel.ItemGroup width="full">
              {featured.map((item, index) => (
                <Carousel.Item key={index} index={index}>
                  <Slide resource={item} key={index} mini={mini} />
                </Carousel.Item>
              ))}
            </Carousel.ItemGroup>

            <SlideInfo
              size={featured.length}
              resource={featured[page]}
              currentSlide={page}
              setPage={setPage}
              mini={mini}
            />
          </Carousel.Control>
        </Carousel.Root>
        {mini && (!isBig || featured.length > slidesPerView || (isMedium && featured.length > 2)) && (
          <IconButton
            aria-label="Next Slide"
            onClick={() => setPage((page + 1) % featured.length)}
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
            resource={featured[page]}
            currentSlide={page}
            setPage={setPage}
            mini={mini}
          />
        )}
      </Box>
      {!mini && <Sidebar resource={featured[page]} />}
    </SimpleGrid>
  );
}
