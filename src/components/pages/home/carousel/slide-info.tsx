import { Avatar, Box, Flex, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import Indicators from "./indicators";

export default function SlideInfo({ resource, size, currentSlide, scrollTo }) {
  const { t } = useTranslation();

  return (
    <Box
      position="absolute"
      backgroundImage="linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.6))"
      bottom={0}
      left={0}
      right={0}
      p={6}
    >
      <Flex justifyContent="space-between" alignItems="flex-end">
        {resource?.authorId > 1 ? (
          <LocalLink key={resource.authorId} href={`/user/show/${resource.authorId}`}>
            <Link>
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
            </Link>
          </LocalLink>
        ) : (
          <div />
        )}
        {size > 1 && (
          <div>
            <Indicators size={size} currentSlide={currentSlide} scrollTo={scrollTo} />
          </div>
        )}
      </Flex>
    </Box>
  );
}
