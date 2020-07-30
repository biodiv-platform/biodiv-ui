import { Avatar, Box, Heading, SimpleGrid, Tooltip } from "@chakra-ui/core";
import { getUserImage } from "@utils/media";
import React from "react";

export default function AdminImageList({ adminList, title }) {
  return (
    <Box mb={10}>
      <Heading m={3} size="lg">
        {title}
      </Heading>
      <Box maxWidth={["100%", "50%"]}>
        <SimpleGrid mt={4} columns={[2, 3, 6]} spacing={2}>
          {adminList.map(({ label, profilePic }, index) => (
            <Tooltip aria-label="member" hasArrow={true} label={label} placement="top">
              <span>
                <Avatar
                  key={index}
                  size="lg"
                  aria-label={label}
                  name={label}
                  src={getUserImage(profilePic, 64)}
                />
              </span>
            </Tooltip>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
