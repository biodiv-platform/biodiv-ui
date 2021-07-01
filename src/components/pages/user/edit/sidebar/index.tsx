import { AspectRatio, Avatar, Box, Button, Flex, VisuallyHidden } from "@chakra-ui/react";
import { axUploadResource } from "@services/files.service";
import { axUpdateUserImage } from "@services/user.service";
import { getUserImage } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import { UserEditPageComponentProps } from "..";

export default function UserInfoSidebar({ user }: UserEditPageComponentProps) {
  const [userImage, setUserImage] = useState(getUserImage(user.profilePic, user.name, 400));
  const { t } = useTranslation();

  const handleOnPhotoUpload = async (e) => {
    if (e.target.files.length) {
      const r = await axUploadResource(e.target.files[0], "users");
      if (r.success) {
        const { success } = await axUpdateUserImage({ id: user.id, profilePic: r.data });
        if (success) {
          setUserImage(getUserImage(r.data, user?.name, 400));
          notification(t("user:updated"), NotificationType.Success);
          return;
        }
      }
    }
    notification(t("user:update_error"));
  };

  return (
    <div>
      <Flex
        flexDirection={{ base: "row", md: "column" }}
        alignItems={{ base: "center", md: "initial" }}
        mb={4}
      >
        <AspectRatio ratio={1} mb={{ md: 4 }} boxSize={{ base: "4rem", md: "auto" }} flexShrink={0}>
          <Avatar position="absolute" boxSize="full" src={userImage} name={user.name} />
        </AspectRatio>
        <Box pl={{ base: 4, md: 0 }}>
          <Button type="button" as="label" cursor="pointer" w="full" colorScheme="blue">
            <VisuallyHidden
              as="input"
              type="file"
              id="user-profile"
              accept="image/*"
              onChange={handleOnPhotoUpload}
            />
            {t("user:upload_photo")}
          </Button>
        </Box>
      </Flex>
    </div>
  );
}
