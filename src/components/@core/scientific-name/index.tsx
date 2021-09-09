import { getInjectableScientificName } from "@utils/text";
import React from "react";

export default function ScientificName({ value }) {
  return <span dangerouslySetInnerHTML={getInjectableScientificName(value)} />;
}
