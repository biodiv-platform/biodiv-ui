import { AspectRatio, Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import Badge from "@components/@core/user/badge";
import useTranslation from "@hooks/use-translation";
import { adminOrAuthor } from "@utils/auth";
import { getUserImage } from "@utils/media";
import React, { useEffect, useState } from "react";

import { UserProfileProps } from "..";

export default function UserInfoSidebar({ user }: UserProfileProps) {
  const userImage = getUserImage(user.profilePic, 400);
  const { t } = useTranslation();
  const [canEdit, setCanEdit] = useState<boolean>();

  useEffect(() => {
    setCanEdit(adminOrAuthor(user.id));
  }, []);

  return (
    <div>
      <Flex flexDirection={{ base: "row", md: "column" }} mb={4}>
        <AspectRatio ratio={1} mb={{ md: 4 }} boxSize={{ base: "4rem", md: "auto" }} flexShrink={0}>
          <Avatar fontSize={{ md: "6xl" }} src={userImage} name={user.name} />
        </AspectRatio>
        <Box pl={{ base: 4, md: 0 }} wordBreak="break-word">
          <Heading as="h1" fontSize="2xl">
            {user.name} <Badge isAdmin={user.isAdmin} />
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {user.userName}
          </Text>
        </Box>
      </Flex>
      <LocalLink href={`/user/edit/${user.id}`}>
        <Button as="a" w="full" colorScheme="blue" mb={4} hidden={!canEdit}>
          {t("USER.EDIT_PROFILE")}
        </Button>
      </LocalLink>
    </div>
  );
}
