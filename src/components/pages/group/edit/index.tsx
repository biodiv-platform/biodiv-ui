import { axGetGroupEditById, axGetGroupMembersById } from "@services/usergroup.service";
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

import UserGroupEditForm from "./userEditForm";

export default function GroupEditComponent({ habitats, speciesGroups }) {
  const { id } = useStoreState((s) => s.currentGroup);
  const [userGroup, setUserGroup] = useState();
  const [adminMembers, setAdminMembers] = useState();

  useEffect(() => {
    axGetGroupEditById(id)
      .then(({ success, data }) => {
        if (success) setUserGroup(data);
      })
      .catch((err) => {
        console.error(err);
      });
    axGetGroupMembersById(id)
      .then(({ success, data }) => {
        if (success) setAdminMembers(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return userGroup && adminMembers ? (
    <div className="container mt">
      <UserGroupEditForm
        userGroup={userGroup}
        userGroupId={id}
        habitats={habitats}
        adminMembers={adminMembers}
        speciesGroups={speciesGroups}
      />
    </div>
  ) : (
    <div></div>
  );
}
