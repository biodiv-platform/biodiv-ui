import "tinymce/icons/default";
import "tinymce/plugins/code";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";
import "tinymce/themes/silver/theme";
import "tinymce/tinymce";

import { Button, Stack } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import CheckIcon from "@icons/check";
import { axSaveLandscapeField, axUploadEditorResource } from "@services/landscape.service";
import { Editor } from "@tinymce/tinymce-react";
import notification, { NotificationType } from "@utils/notification";
import Head from "next/head";
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
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/tinymce@5.4.1/skins/ui/oxide/content.min.css"
        />
        <link rel="stylesheet" href="https://unpkg.com/tinymce@5.4.1/skins/ui/oxide/skin.min.css" />
      </Head>
      <Editor
        value={content}
        init={{
          skin: false,
          width: "100%",
          height: "300px",
          relative_urls: false,
          convert_urls: false,
          plugins: ["link", "image", "table", "code", "lists"],
          toolbar:
            "undo redo | bold italic numlist bullist | alignleft aligncenter alignright alignjustify | link image table | code",
          images_upload_handler: axUploadEditorResource,
          images_upload_base_path: "/"
        }}
        onEditorChange={setContent}
      />
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
