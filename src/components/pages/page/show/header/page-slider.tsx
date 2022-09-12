import "@splidejs/react-splide/css";

import { Box } from "@chakra-ui/react";
import { axGetLicenseList } from "@services/resources.service";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import React, { useEffect, useState } from "react";

interface PageSliderProps {
  images?;
  description;
  pageId;
}

export function PageSlider({ images, description, pageId }: PageSliderProps) {
  const [licenses, setLicenses] = useState({});

  useEffect(() => {
    axGetLicenseList().then(({ data }) =>
      setLicenses(Object.fromEntries(data.map((l) => [l.value, l.label])))
    );
  }, []);

  return (
    <>
      <Box position="absolute" top={0} left={0} bottom={0} right={0}>
        <Splide
          options={{
            fixedHeight: 300,
            type: "fade",
            pagination: false,
            arrows: false,
            autoplay: true,
            rewind: true
          }}
          key={pageId}
        >
          {images.map((image) => (
            <SplideSlide key={image.id}>
              <img
                src={getResourceThumbnail(RESOURCE_CTX.PAGES, image.fileName, RESOURCE_SIZE.PAGE)}
                alt={image.id}
              />
              {description}
              <Box
                position="absolute"
                top={0}
                left={0}
                bottom={0}
                right={0}
                bgGradient="linear(to-r, blackAlpha.500, blackAlpha.400)"
              />
              {image.attribution && (
                <Box position="absolute" left={0} bottom={0} p={4}>
                  {image.caption} by {image.attribution} ({licenses[image.licenseId]})
                </Box>
              )}
            </SplideSlide>
          ))}
        </Splide>
      </Box>
    </>
  );
}
