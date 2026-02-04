import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Avatar } from "@/components/ui/avatar";

import Indicators from "./indicators";

export default function SlideInfo({ resource, size, currentSlide, setPage, /*indicators*/ mini }) {
  const { t } = useTranslation();
  const showIndicators = useBreakpointValue({ base: false, md: true /*indicators*/ });

  return (
    <Box
      position="absolute"
      backgroundImage="linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.6))"
      bottom={0}
      left={0}
      right={0}
      p={6}
      color={resource.color ? resource.color : "white"}
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
                  {t("home:observed_by")}
                </Text>
                <div>{resource.authorName}</div>
              </Box>
            </Flex>
          </LocalLink>
        ) : (
          <div />
        )}
        {!mini && showIndicators && size > 1 && (
          <div>
            <Indicators size={size} currentSlide={currentSlide} setPage={setPage} />
          </div>
        )}
      </Flex>
    </Box>
  );
}
