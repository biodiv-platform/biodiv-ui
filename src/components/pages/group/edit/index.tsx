import UserGroupEditForm from "./userEditForm";
import { useStoreState } from "easy-peasy";
import { axGetGroupEditById } from "@services/usergroup.service";
import React, { useEffect, useState } from "react";

export default function GroupEditComponent({ habitats, speciesGroups }) {
  const { id } = useStoreState((s) => s.currentGroup);
  const [userGroup, setUserGroup] = useState();
  useEffect(() => {
    axGetGroupEditById(id)
      .then(({ success, data }) => {
        if (success) {
          setUserGroup(data);
        }
      })
      .catch((err) => {
        err;
      });
  }, []);
  if (userGroup) {
    return (
      <div className="container mt">
        <UserGroupEditForm
          userGroup={userGroup}
          userGroupId={id}
          habitats={habitats}
          speciesGroups={speciesGroups}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}
