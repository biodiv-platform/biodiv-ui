import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { preProcessContent } from "@utils/pages.util";
import React from "react";

export function Content({ html }) {
  return (
    <Prose>
      <div className="article" dangerouslySetInnerHTML={{ __html: preProcessContent(html) }} />
    </Prose>
  );
}
