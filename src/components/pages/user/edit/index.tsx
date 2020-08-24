import { SimpleGrid } from "@chakra-ui/core";
import { UserProfileData } from "@interfaces/integrator";
import React from "react";

import SideBar from "./sidebar";
import UserEditTabs from "./tabs";

export interface UserEditPageComponentProps {
  user: UserProfileData;
  isAdmin?: boolean;
}

export default function UserEditPageComponent({ user, isAdmin }: UserEditPageComponentProps) {
  return (
    <div className="container mt">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <SideBar user={user} />
        <UserEditTabs isAdmin={isAdmin} user={user} />
      </SimpleGrid>
    </div>
  );
}
