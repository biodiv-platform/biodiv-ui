import NotificationsActiveIcon from "@icons/notifications-active";
import NotificationsNoneIcon from "@icons/notifications-none";
import React, { useEffect, useState } from "react";

import SimpleActionButton from "./simple";

export default function FollowActionButton({
  following,
  resourceId,
  toggleFollowFunc,
  followTitle,
  unFollowTitle
}) {
  const [isFollowing, setIsFollowing] = useState(following);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const toggleFollow = async () => {
    const f = !isFollowing;
    const { success } = await toggleFollowFunc(resourceId, f);
    if (success) {
      setIsFollowing(f);
    }
  };

  return (
    <SimpleActionButton
      icon={isFollowing ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
      title={isFollowing ? unFollowTitle : followTitle}
      colorScheme="blue"
      onClick={toggleFollow}
    />
  );
}
