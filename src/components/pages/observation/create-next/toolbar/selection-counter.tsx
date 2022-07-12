import { Box } from "@chakra-ui/react";
import React from "react";
import { useWatch } from "react-hook-form";

export default function SelectionCounter() {
  const results = useWatch({ name: "o" });
  const selectedCount = results.reduce((total, value) => total + (value.isSelected ? 1 : 0), 0);

  return selectedCount ? <Box ml={1}>({selectedCount})</Box> : null;
}
