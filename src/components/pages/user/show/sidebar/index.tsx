import { AspectRatioBox, Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/core";
import Badge from "@components/@core/user/badge";
import useTranslation from "@configs/i18n/useTranslation";
import { getUserImage } from "@utils/media";
import React from "react";

export default function UserInfoSidebar({ userDetails }) {
  const userImage = getUserImage(userDetails.profilePic, 400);
  const { t } = useTranslation();

  return (
    <div>
      <Flex flexDirection={{ base: "row", md: "column" }} mb={4}>
        <AspectRatioBox ratio={1} mb={{ md: 4 }} size={{ base: "4rem", md: "auto" }} flexShrink={0}>
          <Avatar fontSize={{ md: "6xl" }} src={userImage} name={userDetails.name} />
        </AspectRatioBox>
        <Box pl={{ base: 4, md: 0 }} wordBreak="break-word">
          <Heading as="h1" fontSize="2xl">
            {userDetails.name} <Badge isAdmin={false} />
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {userDetails.userName}
          </Text>
        </Box>
      </Flex>
      <Button w="full" variantColor="blue" mb={4}>
        {t("USER.EDIT_PROFILE")}
      </Button>
    </div>
  );
}
