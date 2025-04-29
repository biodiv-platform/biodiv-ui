import { Box, Checkbox, Image, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import ShadowedUser from "@components/pages/common/shadowed-user";
import { getUserImage } from "@utils/media";
import React from "react";

export default function GridViewCard({ user: { user }, getCheckboxProps, canEdit }) {
  return (
    <Box className="hover-box fade">
      <Box w="full" position="relative" h="16rem">
        {canEdit && getCheckboxProps && (
          <Checkbox
            position="absolute"
            bg="white"
            m={2}
            size={"lg"}
            {...getCheckboxProps({ value: String(user?.id) })}
          />
        )}
        <LocalLink href={`/user/show/${user?.id}`}>
          <Link>
            <Image
              objectFit="cover"
              bg="gray.100"
              w="full"
              h="full"
              src={getUserImage(user?.profilePic, user?.name, 400)}
            />
          </Link>
        </LocalLink>
        <ShadowedUser user={user} avatar={false} />
      </Box>
    </Box>
  );
}
