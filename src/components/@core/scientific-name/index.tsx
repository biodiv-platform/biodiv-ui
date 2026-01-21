import { getInjectableScientificName } from "@utils/text";
import React from "react";

export default function ScientificName({ value }) {
  return (
    <span
      style={{
        wordBreak: "break-word"
      }}
      dangerouslySetInnerHTML={getInjectableScientificName(value)}
    />
  );
}
