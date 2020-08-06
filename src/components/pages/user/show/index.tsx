import { Avatar, Box, Button, Divider, Flex, SimpleGrid } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import HomeDescription from "@components/pages/home/description";
import { adminOrAuthor } from "@utils/auth";
import { formatDate } from "@utils/date";
import { getUserImage } from "@utils/media";
import { useStoreState } from "easy-peasy";
import React from "react";

import TextView from "./user-details-view/text-view";
import UserMapView from "./user-details-view/user-map-view";

export default function UserProfile({ userDetails }) {
  const {
    user: { id: authorId }
  } = useStoreState((s) => s);
  const {
    name,
    profilePic,
    email,
    sexType,
    userName,
    occupation,
    location,
    institution,
    dateCreated,
    lastLoginDate,
    latitude,
    longitude,
    aboutMe
  } = userDetails;

  return (
    <div className="container mt">
      <SimpleGrid columns={[1, 2]} mb={4}>
        <Flex alignItems="center">
          <Avatar mr={4} name={name} src={getUserImage(profilePic, 96)} size="xl" />
          <PageHeading mb={0}>{`${name}`}</PageHeading>
        </Flex>
        <Flex justifyContent={["flex-start", "flex-end"]} alignItems="center">
          <Box background="gray" color="white" p={1} m={3}>
            {adminOrAuthor(authorId) && email}
          </Box>
          {/* button added only for representationl pourpose on ticket requirement, functionlity in future */}
          <Button ml={3} variantColor="blue" size="sm">
            Edit Details
          </Button>
        </Flex>
      </SimpleGrid>
      {aboutMe && <HomeDescription description={aboutMe} />}
      <Divider />
      <SimpleGrid columns={[1, 2]} mb={4} spacing={5}>
        <Box>
          <TextView name="💻 Username" value={userName} />
          <TextView name="🔶 Sex" value={sexType} />
          <TextView name="💌 Occupation" value={occupation} />
          <TextView name="🏢  Institution" value={institution} />
          <TextView name="🔍 Location" value={location} />
          <TextView name="🕗 Member Since" value={formatDate(dateCreated)} />
          <TextView name="🔐 Last Visited" value={formatDate(lastLoginDate)} />
        </Box>
        {longitude && latitude && (
          <Box minHeight="250px">
            <UserMapView latitude={longitude} longitude={latitude} />
          </Box>
        )}
      </SimpleGrid>
    </div>
  );
}
