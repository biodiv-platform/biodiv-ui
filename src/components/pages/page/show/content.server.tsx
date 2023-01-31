import { Prose } from "@nikolovlazar/chakra-ui-prose";
import React from "react";

export function Content({ html }) {
  return (
    <Prose>
      <div className="article" dangerouslySetInnerHTML={{ __html: html }} />
    </Prose>
  );
}
