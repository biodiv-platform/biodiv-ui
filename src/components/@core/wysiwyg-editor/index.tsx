import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/ui/oxide/skin.min.css";

import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/plugins/code";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";
import "tinymce/themes/silver/theme";

import { axUploadEditorResource } from "@services/landscape.service";
import { Editor } from "@tinymce/tinymce-react";
import React from "react";

export default function WYSIWYGEditor(props) {
  return (
    <Editor
      {...props}
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
    />
  );
}
