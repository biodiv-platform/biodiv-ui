import { isBrowser } from "@static/constants";

export const googleSearch = (query) => {
  if (isBrowser) {
    window.location.assign(
      `https://www.google.com/search?as_sitesearch=${encodeURIComponent(
        window.location.host
      )}&q=${encodeURIComponent(query)}`
    );
  }
};
