import { AspectRatio, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import Badge from "@components/@core/user/badge";
import { Role } from "@interfaces/custom";
import { adminOrAuthor, hasAccess } from "@utils/auth";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import { Avatar } from "@/components/ui/avatar";

import { UserProfileProps } from "..";
import DeleteAccount from "./delete-account";

export default function UserInfoSidebar({ user }: UserProfileProps) {
  const userImage = getUserImage(user.profilePic, user.name, 400);
  const { t } = useTranslation();
  const [canEdit, setCanEdit] = useState<boolean>();
  const [canDelete, setCanDelete] = useState<boolean>();

  useEffect(() => {
    setCanEdit(adminOrAuthor(user.id));
    setCanDelete(hasAccess([Role.Admin]));
  }, []);

  return (
    <div>
      <Flex flexDirection={{ base: "row", md: "column" }} mb={4}>
        <AspectRatio ratio={1} mb={{ md: 4 }} boxSize={{ base: "4rem", md: "auto" }} flexShrink={0}>
          <div>
            <Avatar position="absolute" boxSize="full" src={userImage} name={user.name} />
          </div>
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
        <Button w="full" colorPalette="blue" mb={4} hidden={!canEdit}>
          {t("user:edit_profile")}
        </Button>
      </LocalLink>

      {canDelete && <DeleteAccount userId={user.id} />}
    </div>
  );
}
