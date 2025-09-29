import { SimpleGrid } from "@chakra-ui/react";
import { UserProfileData } from "@interfaces/integrator";
import React from "react";

import UserInfoSidebar from "./sidebar";
import UserInfoTabs from "./user-info-tabs";

export interface UserProfileProps {
  user: UserProfileData;
  tab: string;
}

export default function UserShowPageComponent({ user , tab}: UserProfileProps) {
  return (
    <div className="container mt">
      <SimpleGrid mt={12} columns={{ base: 1, md: 4 }} gap={{ base: 0, md: 4 }}>
        <UserInfoSidebar user={user} tab={tab} />
        <UserInfoTabs user={user} tab={tab}/>
      </SimpleGrid>
    </div>
  );
}
