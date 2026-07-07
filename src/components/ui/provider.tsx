"use client";

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

import { customTheme } from "@/configs/theme";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={customTheme}>
      <ColorModeProvider enableColorScheme {...props} />
    </ChakraProvider>
  );
}
