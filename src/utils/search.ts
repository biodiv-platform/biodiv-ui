import { isBrowser } from "@static/constants";

export const googleSearch = (query, lang) => {
  if (isBrowser) {
    window.location.assign(
      `https://www.google.com/search?as_sitesearch=${encodeURIComponent(
        window.location.host
      )}&q=${encodeURIComponent(query)}&hl=${lang}`
    );
  }
};
