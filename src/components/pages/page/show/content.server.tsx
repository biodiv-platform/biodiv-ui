import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { preProcessContent } from "@utils/pages.util";
import React from "react";

export default function Content({ html }) {
  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: preProcessContent(html) }} />
    </Prose>
  );
}
