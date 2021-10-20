import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/plugins/code";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/table";
import "tinymce/themes/silver/theme";

import { Editor } from "@tinymce/tinymce-react";
import Head from "next/head";
import React from "react";

interface WYSIWYGEditorProps {
  uploadHandler?;
  [key: string]: any;
}

export default function WYSIWYGEditor({ uploadHandler, ...props }: WYSIWYGEditorProps) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/tinymce@latest/skins/ui/oxide/content.min.css"
          key="tinymce-0-oxide"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/tinymce@latest/skins/ui/oxide/skin.min.css"
          key="tinymce-1-skin"
        />
      </Head>
      <Editor
        {...props}
        init={{
          skin: false,
          width: "100%",
          height: "300px",
          relative_urls: false,
          convert_urls: false,
          plugins: ["link", "table", "code", "lists", uploadHandler ? "image" : "na"],
          toolbar:
            "undo redo | bold italic numlist bullist | alignleft aligncenter alignright alignjustify | link image table | code",
          images_upload_handler: uploadHandler,
          images_upload_base_path: "/",
          images_dataimg_filter: (img) => img.hasAttribute("internal-blob")
        }}
      />
    </>
  );
}
