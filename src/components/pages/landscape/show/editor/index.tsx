import { Button, Stack } from "@chakra-ui/react";
import WYSIWYGEditor from "@components/@core/wysiwyg-editor";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axSaveLandscapeField, axUploadEditorResource } from "@services/landscape.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

export default function FieldEditor({ initialContent, id, onChange, onClose }) {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialContent);
  const { languageId } = useGlobalState();

  const handleOnSave = async () => {
    const { success } = await axSaveLandscapeField({
      id,
      languageId,
      content
    });
    if (success) {
      notification(t("landscape:update_success"), NotificationType.Success);
      onChange(content);
      onClose();
    } else {
      notification(t("error"));
    }
  };

  return (
    <>
      <WYSIWYGEditor
        value={content}
        onEditorChange={setContent}
        uploadHandler={axUploadEditorResource}
      />
      <Stack isInline={true} spacing={2} mt={2}>
        <Button type="button" colorPalette="blue" onClick={handleOnSave} leftIcon={<CheckIcon />}>
          {t("common:save")}
        </Button>
        <Button type="button" colorPalette="red" onClick={onClose}>
          {t("common:cancel")}
        </Button>
      </Stack>
    </>
  );
}
