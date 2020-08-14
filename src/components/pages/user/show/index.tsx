import { SimpleGrid } from "@chakra-ui/core";
import { User } from "@interfaces/user";
import React from "react";

import UserInfoSidebar from "./sidebar";
import UserInfoTabs from "./user-info-tabs";

interface UserProfileProps {
  userDetails: User;
}

export default function UserProfile({ userDetails }: UserProfileProps) {
  return (
    <div className="container mt">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <UserInfoSidebar userDetails={userDetails} />
        <UserInfoTabs userDetails={userDetails} />
      </SimpleGrid>
    </div>
  );
}
