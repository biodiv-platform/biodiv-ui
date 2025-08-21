import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import BlurBox from "@components/@core/blur-box";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { LuArrowRight } from "react-icons/lu";

const ReadMore = ({ resource, readMoreButtonText, readMoreUIType /*mini*/ }) => {
  return (
    <Box textAlign="right">
      {resource.moreLinks && readMoreUIType === "button" ? (
        <Button colorPalette="teal" variant="solid" size="lg" fontSize="xl" asChild>
          <a href={resource.moreLinks}>
            {readMoreButtonText} <LuArrowRight />
          </a>
        </Button>
      ) : (
        <a href={resource.moreLinks}>
          <Flex alignItems="center" justifyContent="flex-end">
            {readMoreButtonText} <LuArrowRight />
          </Flex>
        </a>
      )}
    </Box>
  );
};

export default function Sidebar({ resource, mini = false }) {
  const { t } = useTranslation();

  const readMoreButtonText =
    resource.readMoreText == null ? t("common:read_more") : resource.readMoreText;

  const readMoreUIType = resource.readMoreUIType;

  const bgThumb = useMemo(() => {
    const resourceType = resource.authorId ? RESOURCE_CTX.OBSERVATION : RESOURCE_CTX.USERGROUPS;
    return getResourceThumbnail(resourceType, resource?.fileName, RESOURCE_SIZE.THUMBNAIL);
  }, [resource?.fileName]);

  const bg = resource.gallerySidebar === "translucent" ? bgThumb : "";

  return (
    <BlurBox
      bg={bg}
      fallbackColor={resource.bgColor ? resource.bgColor : "var(--chakra-colors-gray-800)"}
      {...(mini && { height: 350 })}
    >
      <Center h="full" p={{ base: 6, lg: 8 }} color={resource.color ? resource.color : "white"}>
        <Box>
          <Heading
            as="h1"
            fontWeight={500}
            mb={2}
            fontSize={mini ? "1.5rem" : { base: "1.2rem", lg: "2.2rem" }}
            lineHeight="1.3em"
          >
            {resource.title}
          </Heading>
          <Text
            fontSize={mini ? "sm" : { md: "sm", lg: "lg" }}
            mb={4}
            {...(mini && { height: "13rem" })}
            maxH={mini ? "13rem" : "14rem"}
            overflow="auto"
          >
            {resource.customDescripition}
          </Text>
          <ReadMore
            resource={resource}
            readMoreButtonText={readMoreButtonText}
            readMoreUIType={readMoreUIType}
            //mini={mini}
          />
        </Box>
      </Center>
    </BlurBox>
  );
}
