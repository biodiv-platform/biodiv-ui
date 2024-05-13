/* eslint-disable simple-import-sort/imports */
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/ui/oxide/skin.min.css";

import "tinymce/tinymce";
import "tinymce/models/dom/model";
import "tinymce/icons/default";
import "tinymce/plugins/code";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/media";

import { Editor } from "@tinymce/tinymce-react";
import React from "react";

interface WYSIWYGEditorProps {
  fileUploadHandler?;
  uploadHandler?;
  [key: string]: any;
}

export default function WYSIWYGEditor({
  fileUploadHandler,
  uploadHandler,
  ...props
}: WYSIWYGEditorProps) {
  return (
    <Editor
      {...props}
      init={{
        skin: false,
        width: "100%",
        height: "600px",
        relative_urls: false,
        convert_urls: false,
        plugins: [
          "link",
          "table",
          "code",
          "lists",
          uploadHandler ? "image" : "na",
          fileUploadHandler ? "media" : "na"
        ],
        toolbar:
          "undo redo | bold italic numlist bullist | alignleft aligncenter alignright alignjustify | link image media table | code",
        images_upload_handler: uploadHandler,
        images_upload_base_path: "/",
        file_picker_types: "media",
        file_picker_callback: fileUploadHandler,
        link_class_list: [
          { title: "None", value: "" },
          { title: "Card", value: "preview-card" },
          { title: "Banner", value: "banner-card" }
        ],
        image_class_list: [
          { title: "None", value: "" },
          { title: "Left", value: "img-wrap-left" },
          { title: "Right", value: "img-wrap-right" }
        ],
        content_style: `
          .img-wrap-left { float: left; margin-right: 40px; }
          .img-wrap-right { float: right; margin-left: 40px; }
        `
      }}
    />
  );
}
