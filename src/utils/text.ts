import { filterXSS } from "xss";

/**
 * Detacts Links in text and automatically links them
 *
 * @param {*} text
 * @returns
 */
export const URLify = (text) => {
  const urlRegex = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
  return text.replace(urlRegex, '$1<a rel="noreferrer noopener" target="_blank" href="$2">$2</a>');
};

/**
 * Takes raw HTML from back-end and returns URLified sanitized HTML
 *
 * @param {*} nHtml
 * @returns
 */
export const getInjectableHTML = (nHtml) => {
  try {
    return nHtml
      ? filterXSS(URLify(nHtml), {
          whiteList: {
            a: ["href", "title", "class", "rel", "target"],
            p: [],
            br: [],
            img: ["src"]
          }
        })
      : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};
