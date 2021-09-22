import { Box, Image, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import ShadowedUser from "@components/pages/common/shadowed-user";
import { getUserImage } from "@utils/media";
import React from "react";

export default function GridViewCard({ user: { user } }) {
  return (
    <Box className="hover-box fade">
      <Box w="full" position="relative" h="16rem">
        <LocalLink href={`/user/show/${user?.id}`}>
          <Link>
            <Image
              objectFit="cover"
              bg="gray.100"
              w="full"
              h="full"
              src={getUserImage(user?.profilePic, user?.name)}
            />
          </Link>
        </LocalLink>
        <ShadowedUser user={user} avatar={false} />
      </Box>
    </Box>
  );
}
