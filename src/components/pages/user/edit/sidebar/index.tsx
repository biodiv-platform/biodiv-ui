import { AspectRatioBox, Avatar, Box, Button, Flex, VisuallyHidden } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { getUserImage } from "@utils/media";
import React from "react";

import { UserEditPageComponentProps } from "..";

const VH: any = VisuallyHidden;

export default function UserInfoSidebar({ user }: UserEditPageComponentProps) {
  const userImage = getUserImage(user.profilePic, 400);
  const { t } = useTranslation();
  const handleOnPhotoUpload = () => {};

  return (
    <div>
      <Flex
        flexDirection={{ base: "row", md: "column" }}
        alignItems={{ base: "center", md: "initial" }}
        mb={4}
      >
        <AspectRatioBox ratio={1} mb={{ md: 4 }} size={{ base: "4rem", md: "auto" }} flexShrink={0}>
          <Avatar fontSize={{ md: "6xl" }} src={userImage} name={user.name} />
        </AspectRatioBox>
        <Box pl={{ base: 4, md: 0 }}>
          <Button type="button" as="label" cursor="pointer" w="full" variantColor="blue">
            <VH
              as="input"
              type="file"
              id="user-profile"
              accept="image/*"
              onChange={handleOnPhotoUpload}
            />
            {t("USER.UPLOAD_PHOTO")}
          </Button>
        </Box>
      </Flex>
    </div>
  );
}
