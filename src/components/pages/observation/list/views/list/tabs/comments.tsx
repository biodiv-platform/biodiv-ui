import { Box } from "@chakra-ui/core";
import ActivityList from "@components/pages/observation/show/activity/activity-list";
import Comment from "@components/pages/observation/show/activity/comment";
import React, { useRef } from "react";

export default function CommentsTab({ tabIndex, observationId }) {
  const titleRef = useRef(null);

  return tabIndex === 5 ? (
    <>
      <div ref={titleRef}></div>
      <div>
        <ActivityList observationId={observationId} title="OBSERVATION.COMMENTS.TITLE" />
      </div>
      <Box p={4}>
        <Comment observationId={observationId} focusRef={titleRef} />
      </Box>
    </>
  ) : null;
}
