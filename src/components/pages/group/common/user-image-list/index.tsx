import { Avatar, Box, Heading, Link, Stack } from "@chakra-ui/react";
import { getUserImage } from "@utils/media";
import React from "react";

export default function UserAvatarList({ userList, title }) {
  return (
    <Box mb={6}>
      <Heading size="lg" as="h2" mb={4}>
        {title}
      </Heading>
      <Stack isInline={true} spacing={4}>
        {userList.map(({ name, id, profilePic }) => (
          <Link href={`/user/show/${id}`} key={id} target="_blank">
            <Avatar
              size="lg"
              title={name}
              aria-label={name}
              name={name}
              src={getUserImage(profilePic, 64)}
            />
          </Link>
        ))}
      </Stack>
    </Box>
  );
}
