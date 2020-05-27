import { Avatar, Flex, Link } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { UserIbp } from "@interfaces/activity";
import { getUserImage } from "@utils/media";
import { useStoreState } from "easy-peasy";
import React from "react";

const UserBox = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  padding: 1rem;

  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
`;

export default function ShadowedUser({ user = {} }: { user?: UserIbp }) {
  const { webAddress } = useStoreState((s) => s.currentGroup);

  return (
    <UserBox>
      <Link color="white" href={`${webAddress}/user/show/${user?.id}`}>
        <Flex alignItems="center">
          <Avatar
            mr={2}
            flexShrink={0}
            size="sm"
            name={user?.name}
            src={getUserImage(user?.profilePic)}
          />
          <div className="elipsis-2">{user?.name}</div>
        </Flex>
      </Link>
    </UserBox>
  );
}
