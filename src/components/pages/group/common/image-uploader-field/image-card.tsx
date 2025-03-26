import { CloseButton, Flex, Image } from "@chakra-ui/react";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import React, { useMemo } from "react";

export default function ResourceCard({ resource, setValue, imageSize, simpleUpload, disabled }) {
  const imageURL = useMemo(
    () => getResourceThumbnail(RESOURCE_CTX.USERGROUPS, resource, imageSize),
    [resource]
  );

  const handleRemovePhoto = () => {
    setValue("");
  };

  return (
    <Flex
      className="fade"
      h={simpleUpload ? "6rem" : "13rem"}
      borderRadius="lg"
      bg="white"
      flexDir="column"
      border="1px solid"
      borderColor="gray.300"
      position="relative"
      p={simpleUpload ? 0 : 2}
    >
      <Image
        objectFit="contain"
        h="full"
        w="full"
        borderRadius="md"
        src={imageURL}
      />
      {!disabled && (
        <CloseButton position="absolute" top={0} right={0} size="lg" onClick={handleRemovePhoto} />
      )}
    </Flex>
  );
}
