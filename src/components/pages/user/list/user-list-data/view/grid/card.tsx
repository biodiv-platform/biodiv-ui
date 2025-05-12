import { Box, Image } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import ShadowedUser from "@components/pages/common/shadowed-user";
import { getUserImage } from "@utils/media";
import React from "react";

import { Checkbox } from "@/components/ui/checkbox";

export default function GridViewCard({ user: { user }, getItemProps, canEdit }) {
  return (
    <Box className="hover-box fade">
      <Box w="full" position="relative" h="16rem">
        {canEdit && getItemProps && (
          <Checkbox
            position="absolute"
            bg="white"
            m={2}
            size={"lg"}
            {...getItemProps({ value: String(user?.id) })}
          />
        )}
        <LocalLink href={`/user/show/${user?.id}`}>
          <Image
            objectFit="cover"
            bg="gray.100"
            w="full"
            h="full"
            src={getUserImage(user?.profilePic, user?.name, 400)}
          />
        </LocalLink>
        <ShadowedUser user={user} avatar={false} />
      </Box>
    </Box>
  );
}
