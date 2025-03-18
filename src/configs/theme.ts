import { createSystem, defaultConfig } from "@chakra-ui/react";

const defaultFontFamily =
  "-apple-system,BlinkMacSystemFont,Segoe UI,Inter,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji";

export const customTheme = createSystem(defaultConfig, {
  globalCss: {
    body: {
      scrollBehavior: "smooth"
    }
  },

  theme: {
    tokens: {
      fonts: {
        heading: { value: defaultFontFamily },
        body: { value: defaultFontFamily }
      },
      fontWeights: {
        bold: { value: 600 }
      },
      colors: {
        blue: {
          50: { value: "#ecf8ff" },
          100: { value: "#bee3f8" },
          200: { value: "#90cdf4" },
          300: { value: "#63b3ed" },
          400: { value: "#4299e1" },
          500: { value: "#2E75C2" },
          600: { value: "#2b6cb0" },
          700: { value: "#2c5282" },
          800: { value: "#2a4365" },
          900: { value: "#273c58" }
        }
      }
    }
  }

  // components: {
  //   Input: {
  //     sizes: {
  //       md: {
  //         addon: { px: 2.5 },
  //         field: { px: 2.5 }
  //       }
  //     }
  //   }
  // }
});
