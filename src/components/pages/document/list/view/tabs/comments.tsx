import { Box } from "@chakra-ui/react";
import ActivityList from "@components/pages/observation/show/activity/activity-list";
import Comment from "@components/pages/observation/show/activity/comment";
import { axAddDocumentComment } from "@services/activity.service";
import { RESOURCE_TYPE } from "@static/constants";
import React, { useRef } from "react";

export default function CommentsTab({ tabIndex, documentId, tabLength }) {
  const titleRef = useRef(null);

  return tabIndex === tabLength ? (
    <>
      <div ref={titleRef}></div>
      <div>
        <ActivityList
          resourceId={documentId}
          resourceType={RESOURCE_TYPE.DOCUMENT}
          title="OBSERVATION.COMMENTS.TITLE"
        />
      </div>
      <Box p={4}>
        <Comment
          resourceId={documentId}
          resourceType={RESOURCE_TYPE.DOCUMENT}
          focusRef={titleRef}
          commentFunc={axAddDocumentComment}
        />
      </Box>
    </>
  ) : null;
}
