import flat from "flat";

/**
 * Creates root css variables to unused colors are excluded
 *
 * @param {*} { colors }
 * @returns {String}
 */
export const jsontocss = ({ colors: c }): string => {
  const flatColors: Record<string, string> = flat(
    {
      white: c.white,
      gray: c.gray,
      red: c.red,
      yellow: c.yellow,
      blue: c.blue
    },
    { delimiter: "-" }
  );
  let css = ":root{";
  for (const [key, value] of Object.entries(flatColors)) {
    css = css.concat(`--${key.toLowerCase()}: ${value};`);
  }
  css = css.concat("}");
  return css;
};
