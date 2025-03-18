"use client";

import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

import { customTheme } from "@/configs/theme";

import { type ColorModeProviderProps, ColorModeProvider } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={customTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
