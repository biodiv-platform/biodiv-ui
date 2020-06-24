import { CloseButton, Flex, Image } from "@chakra-ui/core";
import { getGroupImageThumb } from "@utils/media";
import React, { useMemo } from "react";

export default function ResourceCard({ resource, setValue }) {
  const imageURL = useMemo(() => getGroupImageThumb(resource, 300), [resource]);

  const handleRemovePhoto = () => {
    setValue(null);
  };

  return (
    <Flex
      className="fade"
      h="13rem"
      borderRadius="lg"
      bg="white"
      flexDir="column"
      border="1px solid"
      borderColor="gray.300"
      position="relative"
      p={2}
    >
      <Image
        objectFit="contain"
        h="full"
        w="full"
        borderRadius="md"
        ignoreFallback={true}
        src={imageURL}
      />
      <CloseButton position="absolute" top={0} right={0} size="lg" onClick={handleRemovePhoto} />
    </Flex>
  );
}
