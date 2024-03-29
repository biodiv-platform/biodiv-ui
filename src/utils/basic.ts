import { nanoid } from "nanoid";

export const compiledMessage = (templateString: string, templateVariables) => {
  return templateVariables
    ? templateString.replace(/\${(.*?)}/g, (_, g) => templateVariables[g])
    : templateString;
};

export const absoluteUrl = (ctx, asPath?, setLocalhost?) => {
  let protocol = "https:";
  let host = ctx?.req
    ? ctx.req.headers["x-forwarded-host"] || ctx.req.headers["host"]
    : window.location.host;
  if (host?.indexOf("localhost") > -1) {
    if (setLocalhost) {
      host = setLocalhost;
    }
    protocol = "http:";
  }

  return new URL(`${protocol}//${host}${asPath || ctx?.resolvedUrl || ctx?.req?.url || ""}`);
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
 * Works similar to loadash's `_.get` to retrive value from nested objects
 * getByPath(input,path)
 * path input.0.name
 * input [{name:"text"}]
 * output "text"
 * @param {*} obj
 * @param {*} path
 * @returns
 */
export const getByPath = (obj, path) => {
  path.split(".").forEach(function (level) {
    if (!obj) {
      return;
    }
    obj = obj[level];
  });

  return obj;
};

export const normalizeFileName = (s) => `${nanoid()}_${s.replace(/([^a-z0-9\.\s]+)/gi, "-")}`;

/**
 * Removes keys with empty/null/falsy value from object
 * Used mostly when you want to keep query params clean in address bar
 *
 * @param {*} [obj={}]
 * @return {*}  {*}
 */
export const removeEmptyKeys = (obj = {}): any =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => (Array.isArray(v) ? v.length : v)));
