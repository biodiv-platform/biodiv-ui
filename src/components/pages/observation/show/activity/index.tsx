import { Box } from "@chakra-ui/core";
import React, { useRef } from "react";
import LazyLoad from "react-lazyload";

import ActivityList from "./activity-list";
import Comment from "./comment";

export default function Activity({ observationId }) {
  const titleRef = useRef(null);

  return (
    <>
      <LazyLoad once={true}>
        <div ref={titleRef}></div>
        <Box mb={4} className="fadeInUp white-box">
          <ActivityList observationId={observationId} />
        </Box>
        <Box mb={4} p={4} className="fadeInUp delay-1 white-box">
          <Comment observationId={observationId} focusRef={titleRef} />
        </Box>
      </LazyLoad>
    </>
  );
}
