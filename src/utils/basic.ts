export const compiledMessage = (templateString: string, templateVariables) =>
  templateString.replace(/\${(.*?)}/g, (_, g) => templateVariables[g]);

export const absoluteUrl = (req, setLocalhost?) => {
  let protocol = "https:";
  let host = req ? req.headers["x-forwarded-host"] || req.headers["host"] : window.location.host;
  if (host.indexOf("localhost") > -1) {
    if (setLocalhost) {
      host = setLocalhost;
    }
    protocol = "http:";
  }

  return new URL(`${protocol}//${host}${req?.url || ""}`);
};

export const toKey = (s = "") => s.split(" ").join("_").toUpperCase();

export const titleCase = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : undefined;

export const stringToArray = (l) => {
  if (!l || Array.isArray(l)) {
    return l || [];
  }
  return l.split(",");
};

/**
 * Temporary function should be removed once group context is fully migrated
 *
 * @param {string} url
 * @returns {string}
 */
export const getGroupLink = (url): string => {
  return url.includes("/group/") ? url + "/show" : url;
};
