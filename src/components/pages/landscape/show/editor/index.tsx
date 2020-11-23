import { Button, Stack } from "@chakra-ui/react";
import WYSIWYGEditor from "@components/@core/wysiwyg-editor";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { axSaveLandscapeField } from "@services/landscape.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";

export default function FieldEditor({ initialContent, id, onChange, onClose }) {
  const { t, localeId: languageId } = useTranslation();
  const [content, setContent] = useState(initialContent);

  const handleOnSave = async () => {
    const { success } = await axSaveLandscapeField({
      id,
      languageId,
      content
    });
    if (success) {
      notification(t("LANDSCAPE.UPDATE_SUCCESS"), NotificationType.Success);
      onChange(content);
      onClose();
    } else {
      notification(t("ERROR"));
    }
  };

  return (
    <>
      <WYSIWYGEditor value={content} onEditorChange={setContent} />
      <Stack isInline={true} spacing={2} mt={2}>
        <Button type="button" colorScheme="blue" onClick={handleOnSave} leftIcon={<CheckIcon />}>
          {t("SAVE")}
        </Button>
        <Button type="button" colorScheme="red" onClick={onClose}>
          {t("CANCEL")}
        </Button>
      </Stack>
    </>
  );
}
