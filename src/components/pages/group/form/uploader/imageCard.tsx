import { CloseButton, Flex, Image } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { getGroupImageThumb } from "@utils/media";
import { OBSERVATION_FALLBACK } from "@static/inline-images";
import React, { useMemo } from "react";

const ImageBox = styled.div`
  flex-grow: 1;
  margin-bottom: 0.5rem;
  position: relative;
  img {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  svg {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0.5rem;
  }
`;

export const getImageThumb = (resource, size = 140): string => {
  return getGroupImageThumb(resource.path, size);
};

export default function ResourceCard({ resource, setValue }) {
  const imageURL = useMemo(() => getImageThumb(resource), []);

  const handleRemovePhoto = () => {
    setValue(null);
  };

  return (
    <Flex
      className="fade"
      minH="10rem"
      borderRadius="lg"
      bg="white"
      flexDir="column"
      border="1px solid"
      borderColor="gray.300"
      position="relative"
      p={2}
    >
      <ImageBox>
        <Image
          objectFit="cover"
          borderRadius="md"
          fallbackSrc={OBSERVATION_FALLBACK.DEFAULT}
          src={imageURL}
        />
      </ImageBox>
      <CloseButton
        position="absolute"
        top="200"
        right="200"
        size="lg"
        color="#FF0000"
        onClick={() => handleRemovePhoto()}
      />
    </Flex>
  );
}
