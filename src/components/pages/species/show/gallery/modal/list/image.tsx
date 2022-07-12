import { Box, Image, Link, SimpleGrid, Skeleton } from "@chakra-ui/react";
import ShadowedUser from "@components/pages/common/shadowed-user";
import { RESOURCE_SIZE } from "@static/constants";
import { getFallbackByMIME, getResourceRAW, getResourceThumbnail } from "@utils/media";
import React from "react";

interface SpeciesGalleryImageProps {
  resources;
  isLoading?;
}

export const SpeciesGalleryImage = ({ resources, isLoading }: SpeciesGalleryImageProps) => (
  <SimpleGrid spacing={4} columns={{ md: 3, lg: 5 }} mb={4}>
    {resources.map(({ resource, userIbp, observationId }) => (
      <Box className="white-box fade" key={resource.id} overflow="hidden">
        <a href={`/observation/show/${observationId}`}>{observationId}</a>
        <Box position="relative">
          <Link isExternal={true} href={getResourceRAW(resource.context, resource.fileName)}>
            <Image
              w="full"
              h="12.5rem"
              objectFit="cover"
              fallbackSrc={getFallbackByMIME(resource.type)}
              src={getResourceThumbnail(resource.context, resource.fileName, RESOURCE_SIZE.DEFAULT)}
            />
          </Link>
          <ShadowedUser user={userIbp} />
        </Box>
      </Box>
    ))}
    {isLoading && (
      <>
        {new Array(10).fill(0).map((_, index) => (
          <Skeleton h="12.5rem" w="full" borderRadius="md" key={index} />
        ))}
      </>
    )}
  </SimpleGrid>
);
