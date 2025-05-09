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
          scrollBehavior: "smooth"
        }
      }
    },
    components: {
      Input: {
        sizes: {
          md: {
            addon: { px: 2.5 },
            field: { px: 2.5 }
          }
        }
      }
    }
  },
  withProse({
    baseStyle: {
      h5: {
        fontSize: "md",
        fontWeight: "bold",
        fontFamily: defaultFontFamily
      },
      h6: {
        fontSize: "sm",
        fontWeight: "bold",
        fontFamily: defaultFontFamily
      },
      a: {
        color: "blue.500",
        wordBreak: "break-all"
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
