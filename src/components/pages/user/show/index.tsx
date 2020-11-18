import { SimpleGrid } from "@chakra-ui/react";
import { UserProfileData } from "@interfaces/integrator";
import React from "react";

import UserInfoSidebar from "./sidebar";
import UserInfoTabs from "./user-info-tabs";

export interface UserProfileProps {
  user: UserProfileData;
}

export default function UserShowPageComponent({ user }: UserProfileProps) {
  return (
    <div className="container mt">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <UserInfoSidebar user={user} />
        <UserInfoTabs user={user} />
      </SimpleGrid>
    </div>
  );
}
