import { Box, Carousel } from "@chakra-ui/react";
import { axGetLicenseList } from "@services/resources.service";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import React, { useEffect, useState } from "react";

interface PageSliderProps {
  images?;
  description;
}

export function PageSlider({ images, description }: PageSliderProps) {
  const [licenses, setLicenses] = useState({});

  useEffect(() => {
    axGetLicenseList().then(({ data }) =>
      setLicenses(Object.fromEntries(data.map((l) => [l.value, l.label])))
    );
  }, []);

  return (
    <>
      <Box position="absolute" inset={0} w="full" h="full" overflow="hidden">
        <Carousel.Root autoplay loop slideCount={images.length} w="full" h="full">
          <Carousel.Control w="full" h="full" position="relative">
            <Carousel.ItemGroup w="full" h="full">
              {images.map((image, index) => (
                <Carousel.Item key={image.id} index={index} w="full" h="full" position="relative">
                  <Box
                    position="absolute"
                    inset={0}
                    bgImage={`url(${getResourceThumbnail(
                      RESOURCE_CTX.PAGES,
                      image.fileName,
                      RESOURCE_SIZE.PAGE
                    )})`}
                    bgSize="cover"
                  />

                  <Box
                    position="absolute"
                    inset={0}
                    bgGradient="linear(to-r, blackAlpha.500, blackAlpha.400)"
                  />

                  {description}

                  {image.attribution && (
                    <Box position="absolute" left={0} bottom={0} p={4}>
                      {image.caption} by {image.attribution} ({licenses[image.licenseId]})
                    </Box>
                  )}
                </Carousel.Item>
              ))}
            </Carousel.ItemGroup>
          </Carousel.Control>
        </Carousel.Root>
      </Box>
    </>
  );
}
