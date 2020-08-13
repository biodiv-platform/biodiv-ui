import { Box, Button, FormControl, FormLabel } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axUserSearch } from "@services/auth.service";
import { ACTIVITY_UPDATED } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { emit } from "react-gbus";
import { Mention, MentionsInput } from "react-mentions";

export default function Comment({ resourceId, resourceType, focusRef, commentFunc }) {
  const [text, setText] = useState("");
  const { t } = useTranslation();

  const onMentionQuery = (q, callback) => {
    if (!q) {
      return;
    }
    axUserSearch(q).then(({ data }) => callback(data));
  };

  const onTextChange = (e, value) => {
    setText(value);
  };

  const handleOnComment = async () => {
    const { success } = await commentFunc({
      body: text,
      rootHolderId: resourceId,
      rootHolderType: resourceType,
      subRootHolderId: null,
      subRootHolderType: null
    });
    if (success) {
      notification("Comment Added", NotificationType.Success);
      setText("");
      emit(ACTIVITY_UPDATED, resourceId);
      focusRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <Box>
      <FormControl isInvalid={false} mb={4}>
        <FormLabel htmlFor="comment" mb={2}>
          {t("OBSERVATION.COMMENTS.ADD_COMMENT")}
        </FormLabel>
        <MentionsInput
          id="comment"
          className="textarea"
          name="comment"
          height="100px"
          value={text}
          allowSpaceInQuery={true}
          onChange={onTextChange}
        >
          <Mention trigger="@" data={onMentionQuery} />
        </MentionsInput>
      </FormControl>
      <Button variantColor="blue" onClick={handleOnComment}>
        {t("OBSERVATION.COMMENTS.POST")}
      </Button>
    </Box>
  );
}
