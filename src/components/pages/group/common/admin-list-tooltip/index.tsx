import { Image, SimpleGrid, Tooltip, Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import { getUserImage } from "@utils/media";
import React from "react";

export default function AdminListTooltip({ adminList, title }) {
  return (
    <Box maxWidth={["100%", null, null, "70%"]}>
      <BoxHeading>{title}</BoxHeading>
      <SimpleGrid mt={4} columns={[2, 3, 6]} spacing={2}>
        {adminList.map(({ label, profilePic }, index) => {
          return (
            <Tooltip
              key={index}
              aria-label="admin-image"
              label={label}
              placement="top"
              hasArrow={true}
            >
              <Image
                size="7rem"
                ignoreFallback={true}
                src={getUserImage(profilePic, 200)}
                alt={label}
              />
            </Tooltip>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
