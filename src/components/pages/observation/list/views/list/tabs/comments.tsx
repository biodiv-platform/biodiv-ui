import { Box } from "@chakra-ui/react";
import ActivityList from "@components/pages/observation/show/activity/activity-list";
import Comment from "@components/pages/observation/show/activity/comment";
import { axAddObservationComment } from "@services/activity.service";
import { RESOURCE_TYPE } from "@static/constants";
import React, { useRef } from "react";

export default function CommentsTab({ observationId }) {
  const titleRef = useRef(null);

  return (
    <>
      <div ref={titleRef}></div>
      <div>
        <ActivityList
          resourceId={observationId}
          resourceType={RESOURCE_TYPE.OBSERVATION}
          title="form:comments.title"
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
  );
}
