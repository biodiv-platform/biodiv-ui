import { Box } from "@chakra-ui/core";
import React, { useRef } from "react";
import LazyLoad from "react-lazyload";

import ActivityList from "./activity-list";
import Comment from "./comment";

export default function Activity({ resourceId, resourceType, commentFunc }) {
  const titleRef = useRef(null);

  return (
    <>
      <LazyLoad once={true}>
        <div ref={titleRef}></div>
        <Box mb={4} className="fadeInUp white-box">
          <ActivityList resourceType={resourceType} resourceId={resourceId} />
        </Box>
        <Box mb={4} p={4} className="fadeInUp delay-1 white-box">
          <Comment
            resourceId={resourceId}
            resourceType={resourceType}
            focusRef={titleRef}
            commentFunc={commentFunc}
          />
        </Box>
      </LazyLoad>
    </>
  );
}
