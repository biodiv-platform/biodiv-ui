import { createSystem, defaultConfig, defineRecipe } from "@chakra-ui/react";

const defaultFontFamily =
  "-apple-system,BlinkMacSystemFont,Segoe UI,Inter,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji";

const inputRecipe = defineRecipe({
  className: "input",
  variants: {
    size: {
      md: {
        addon: { px: "2.5" },
        field: { px: "2.5" }
      }
    }
  }
});

export const customTheme = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      scrollBehavior: "smooth",
      bg: "gray.50"
    }
  },

  theme: {
    recipes: {
      Input: inputRecipe
    },
    tokens: {
      fonts: {
        heading: { value: defaultFontFamily },
        body: { value: defaultFontFamily }
      },
      fontWeights: {
        bold: { value: 600 }
      },
      fontSizes: {
        sm: { value: "16px" }
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
        },
        gray: {
          50: { value: "#f7fafc" },
          100: { value: "#edf2f7" },
          200: { value: "#e2e8f0" },
          300: { value: "#cbd5e0" },
          400: { value: "#a0aec0" },
          500: { value: "#718096" },
          600: { value: "#4a5568" },
          700: { value: "#2d3748" },
          800: { value: "#1a202c" },
          900: { value: "#171923" }
        }
      }
    }
  }
});
