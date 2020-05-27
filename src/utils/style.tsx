import flat from "flat";

/**
 * Creates root css variables to unused colors are excluded
 *
 * @param {*} { colors }
 * @returns {String}
 */
export const jsontocss = ({ colors }): string => {
  const {
    linkedin,
    blackalpha,
    green,
    facebook,
    messenger,
    whatsapp,
    twitter,
    telegram,
    pink,
    orange,
    teal,
    cyan,
    purple,
    ...scolors
  } = colors;
  const flatColors = flat(scolors, { delimiter: "-" });
  let css = ":root{";
  for (const [key, value] of Object.entries(flatColors)) {
    css = css.concat(`--${key.toLowerCase()}: ${value};`);
  }
  css = css.concat("}");
  return css;
};
