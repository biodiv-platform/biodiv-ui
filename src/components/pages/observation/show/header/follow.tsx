import { axFollowObservation } from "@services/observation.service";
import React, { useEffect, useState } from "react";

import SimpleButton from "./simple-button";

export default function FollowObservation({ following, observationId }) {
  const [isFollowing, setIsFollowing] = useState(following);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const toggleFollow = async () => {
    const f = !isFollowing;
    const { success } = await axFollowObservation(observationId, f);
    if (success) {
      setIsFollowing(f);
    }
  };
  return (
    <SimpleButton
      icon={isFollowing ? "ibpnotificationsactive" : "ibpnotificationsnone"}
      title={isFollowing ? "UNFOLLOW_OBSERVATION" : "FOLLOW_OBSERVATION"}
      variantColor="blue"
      onClick={toggleFollow}
    />
  );
}
