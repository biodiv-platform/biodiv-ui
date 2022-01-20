import { extendTheme } from "@chakra-ui/react";

const defaultFontFamily =
  "-apple-system,BlinkMacSystemFont,Segoe UI,Inter,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji";

export const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
        scrollBehavior: "smooth"
      }
    }
  },
  fonts: {
    body: defaultFontFamily,
    heading: defaultFontFamily
  },
  fontWeights: {
    bold: 600
  },
  colors: {
    blue: {
      50: "#ecf8ff",
      100: "#bee3f8",
      200: "#90cdf4",
      300: "#63b3ed",
      400: "#4299e1",
      500: "#2E75C2",
      600: "#2b6cb0",
      700: "#2c5282",
      800: "#2a4365",
      900: "#273c58"
    }
  }
});
