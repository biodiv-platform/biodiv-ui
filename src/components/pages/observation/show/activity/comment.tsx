// Comment.jsx
import { Box, Button } from "@chakra-ui/react";
import useGlobalState from "@hooks/use-global-state";
import { axEsUserAutoComplete } from "@services/auth.service";
import { ACTIVITY_UPDATED } from "@static/events";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useCallback } from "react";
import { emit } from "react-gbus";

import { Field } from "@/components/ui/field";

import MentionTextarea from "./mention-text-area";
import { useMentionInput } from "./use-mention-input";



export default function Comment({ resourceId, resourceType, focusRef, commentFunc }) {
  const { t } = useTranslation();
  const { languageId } = useGlobalState();

  const fetchSuggestions = useCallback(async (query) => {
    const { data } = await axEsUserAutoComplete(query);
    return data;
  }, []);

  const mention = useMentionInput({ fetchSuggestions });

  const handleOnComment = async () => {
    const { success } = await commentFunc({
      body: mention.buildSubmitBody(),
      languageId: languageId,
      rootHolderId: resourceId,
      rootHolderType: resourceType,
      subRootHolderId: null,
      subRootHolderType: null,
    });
    if (success) {
      notification("Comment Added", NotificationType.Success);
      mention.reset();
      emit(ACTIVITY_UPDATED, resourceId);
      focusRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <Box>
      <Field invalid={false} mb={4}>
        <Field htmlFor="comment" mb={2}>
          {t("form:comments.add_comment")}
        </Field>
        <Box width="full">
          <MentionTextarea
            mention={mention}
            textareaProps={{ id: "comment", name: "comment", height: "100px" }}
            renderSuggestion={(user, focused) => (
              <div className={`user ${focused ? "focused" : ""}`}>{`${user.name} (${user.id})`}</div>
            )}
          />
        </Box>
      </Field>
      <Button colorPalette="blue" onClick={handleOnComment}>
        {t("form:comments.post")}
      </Button>
    </Box>
  );
}
