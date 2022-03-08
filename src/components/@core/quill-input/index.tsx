import "quill/dist/quill.snow.css";

import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";

const QuillBox = styled.div`
  border-radius: 0.25rem;
  .ql-container,
  .ql-toolbar {
    background: var(--chakra-colors-white);
    border-radius: 0.25rem;
  }
  .ql-container {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: 6.5em;
    overflow-y: auto;
  }
  .ql-toolbar {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

interface QuillInputProps {
  value?;
  onChange;
}

const QuillInput = ({ value: EValue, onChange }: QuillInputProps) => {
  const [value, setValue] = useState(EValue);

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"]
      ]
    }
  });

  useEffect(() => {
    if (quill) {
      quill.setContents(quill.clipboard.convert(value || ""));

      quill.on("text-change", () => {
        setValue(quill.root.innerHTML);
      });
    }
  }, [quill]);

  useEffect(() => {
    onChange(value);
  }, [value]);

  /*
   * diffing before hard updating quill
   * This is useful when key gets updated externally
   * for example importing `BibTex` file
   */
  useEffect(() => {
    if (EValue !== value) {
      quill.clipboard.dangerouslyPasteHTML(EValue);
    }
  }, [EValue]);

  return (
    <QuillBox>
      <div ref={quillRef} />
    </QuillBox>
  );
};

export default QuillInput;
