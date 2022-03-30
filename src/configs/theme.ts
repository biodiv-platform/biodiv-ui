import { extendTheme } from "@chakra-ui/react";
import { withProse } from "@nikolovlazar/chakra-ui-prose";

const defaultFontFamily =
  "-apple-system,BlinkMacSystemFont,Segoe UI,Inter,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji";

export const customTheme = extendTheme(
  {
    colors: {
      blue: {
        "50": "#ecf8ff",
        "100": "#bee3f8",
        "200": "#90cdf4",
        "300": "#63b3ed",
        "400": "#4299e1",
        "500": "#2E75C2",
        "600": "#2b6cb0",
        "700": "#2c5282",
        "800": "#2a4365",
        "900": "#273c58"
      }
    },
    fonts: {
      body: defaultFontFamily,
      heading: defaultFontFamily
    },
    fontWeights: {
      bold: 600
    },
    styles: {
      global: {
        body: {
          bg: "gray.50",
          scrollBehavior: "smooth"
        }
      }
    }
  },
  withProse({
    baseStyle: {
      a: {
        color: "blue.500"
      },
      table: {
        td: {
          border: "1px solid",
          borderColor: "gray.300",
          p: 2,
          verticalAlign: "inherit"
        },
        th: {
          border: "1px solid",
          borderColor: "gray.300",
          p: 2,
          verticalAlign: "inherit"
        },
        tr: {
          border: 0
        }
      }
    }
  })
);
