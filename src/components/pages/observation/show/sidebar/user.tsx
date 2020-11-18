import { Avatar, Box, Link, SimpleGrid } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import Badge from "@components/@core/user/badge";
import useGlobalState from "@hooks/use-global-state";
import { UserIbp } from "@interfaces/observation";
import { getUserImage } from "@utils/media";
import React from "react";

const User = ({ user }: { user: UserIbp }) => {
  const { currentGroup } = useGlobalState();
  const userProfileLink = `${currentGroup?.webAddress}/user/show/${user.id}`;

  return (
    <SimpleGrid
      columns={5}
      py={4}
      mb={4}
      alignItems="center"
      className="white-box fadeInUp delay-4"
    >
      <LocalLink href={userProfileLink}>
        <Link justifySelf="center" px={4}>
          <Avatar name={user.name} src={getUserImage(user.profilePic)} />
        </Link>
      </LocalLink>
      <Box gridColumn="2/6">
        <LocalLink href={userProfileLink}>
          <BlueLink className="text-elipsis" fontWeight="bold">
            {user.name} <Badge isAdmin={user.isAdmin} />
          </BlueLink>
        </LocalLink>
      </Box>
    </SimpleGrid>
  );
};

export default User;
