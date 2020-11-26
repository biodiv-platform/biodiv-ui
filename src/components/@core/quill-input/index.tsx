import "quill/dist/quill.snow.css";

import styled from "@emotion/styled";
import React from "react";
import { useQuill } from "react-quilljs";

const QuillBox = styled.div`
  border-radius: 0.25rem;
  .ql-container,
  .ql-toolbar {
    background: var(--white);
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

const QuillInput = ({ value, onChange }: QuillInputProps) => {
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

  React.useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value || "");

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill]);

  return (
    <QuillBox>
      <div ref={quillRef} />
    </QuillBox>
  );
};

export default QuillInput;
