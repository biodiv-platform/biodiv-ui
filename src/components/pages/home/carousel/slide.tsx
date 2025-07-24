import { Box, Flex, Image, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, getUserImage, RESOURCE_CTX } from "@utils/media";
import React from "react";

import { Avatar } from "@/components/ui/avatar";

import Sidebar from "./sidebar";

export default function Slide({ resource, mini }) {
  const resourceType = resource.authorId ? RESOURCE_CTX.OBSERVATION : RESOURCE_CTX.USERGROUPS;
  const SlideImage = () => (
    <>
      <Image
        src={getResourceThumbnail(resourceType, resource?.fileName, RESOURCE_SIZE.PREVIEW)}
        h={{ base: mini ? 160 : 240, md: mini ? 220 : 420, lg: mini ? 220 : 500 }}
        w="full"
        objectFit="cover"
        loading="lazy"
        alt={resource.id}
      />
      {mini && (
        <Box
          backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.6))"
          bottom={0}
          left={0}
          right={0}
          p={6}
        >
          <Flex justifyContent="space-between" alignItems="flex-end">
            {resource?.authorId > 1 ? (
              <LocalLink
                key={resource.authorId}
                href={`/user/show/${resource.authorId}`}
                prefixGroup={true}
              >
                <Flex alignItems="center">
                  <Avatar
                    mr={2}
                    flexShrink={0}
                    size="sm"
                    name={resource.authorName}
                    src={getUserImage(resource.authorImage, resource.authorName)}
                  />
                  <Box className="credits-text">
                    <Text lineHeight="1em" fontSize="xs">
                      {"Observation By"}
                    </Text>
                    <div>{resource.authorName}</div>
                  </Box>
                </Flex>
              </LocalLink>
            ) : (
              <div />
            )}
          </Flex>
        </Box>
      )}
    </>
  );

  return (
    <Box className="keen-slider__slide" style={{ minWidth: "100%" }}>
      {resource.observationId ? (
        <>
          <LocalLink href={`/observation/show/${resource.observationId}`} prefixGroup={true}>
            <SlideImage />
          </LocalLink>
          {mini && (
            <>
              <Sidebar resource={resource} mini={mini} />
            </>
          )}
        </>
      ) : (
        <>
          <SlideImage />
          {mini && <Sidebar resource={resource} mini={mini} />}
        </>
      )}
    </Box>
  );
}
