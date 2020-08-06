import { Box } from "@chakra-ui/core";
import ActivityList from "@components/pages/observation/show/activity/activity-list";
import Comment from "@components/pages/observation/show/activity/comment";
import { axAddObservationComment } from "@services/activity.service";
import { RESOURCE_TYPE } from "@static/constants";
import React, { useRef } from "react";

export default function CommentsTab({ tabIndex, observationId }) {
  const titleRef = useRef(null);

  return tabIndex === 5 ? (
    <>
      <div ref={titleRef}></div>
      <div>
        <ActivityList
          resourceId={observationId}
          resourceType={RESOURCE_TYPE.OBSERVATION}
          title="OBSERVATION.COMMENTS.TITLE"
        />
      </div>
      <Box p={4}>
        <Comment
          resourceId={observationId}
          resourceType={RESOURCE_TYPE.OBSERVATION}
          focusRef={titleRef}
          commentFunc={axAddObservationComment}
        />
      </Box>
    </>
  ) : null;
}
