import { Box, Link, SimpleGrid } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import Badge from "@components/@core/user/badge";
import { UserIbp } from "@interfaces/observation";
import { getUserImage } from "@utils/media";
import React from "react";

import { Avatar } from "@/components/ui/avatar";

interface UserProps {
  user: UserIbp | undefined;
}

const User = ({ user }: UserProps) =>
  user ? (
    <SimpleGrid columns={5} py={4} mb={4} alignItems="center" className="white-box">
      <Link justifySelf="center" px={4} href={`/user/show/${user.id}`}>
        <Avatar name={user.name} src={getUserImage(user.profilePic, user.name)} />
      </Link>
      <Box gridColumn="2/6">
        <BlueLink className="text-elipsis" fontWeight="bold" href={`/user/show/${user.id}`}>
          {user.name} <Badge isAdmin={user.isAdmin} />
        </BlueLink>
      </Box>
    </SimpleGrid>
  ) : null;

export default User;
