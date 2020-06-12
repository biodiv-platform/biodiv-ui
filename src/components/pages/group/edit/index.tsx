import UserGroupEditForm from "./userEditForm";
import { useStoreState } from "easy-peasy";
import { axGetGroupEditById, axGetGroupMembersById } from "@services/usergroup.service";
import React, { useEffect, useState } from "react";

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
        err;
      });
    axGetGroupMembersById(id)
      .then(({ success, data }) => {
        if (success) setAdminMembers(data);
      })
      .catch((err) => err);
  }, []);

  if (userGroup && adminMembers) {
    return (
      <div className="container mt">
        <UserGroupEditForm
          userGroup={userGroup}
          userGroupId={id}
          habitats={habitats}
          adminMembers={adminMembers}
          speciesGroups={speciesGroups}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}
