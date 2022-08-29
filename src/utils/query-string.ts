import { parse as p, ParseOptions, parseUrl as pUrl, stringify as s } from "query-string";

// extends existing `query-string` package and sets below option by default

const DEFAULT_OPTIONS: ParseOptions = {
  arrayFormat: "comma",
  parseNumbers: true,
  parseBooleans: true
};

export const stringify = (object) => s(object, DEFAULT_OPTIONS);

export const parse = (object, arrayFields?: string[]) => {
  const parsed = p(object, DEFAULT_OPTIONS);

  // forces keys inside arrayFields to be parsed as array
  if (arrayFields) {
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        arrayFields.includes(key) ? (Array.isArray(value) ? value : [value]) : value
      ])
    );
  }

  return parsed;
};

export const parseUrl = (object) => pUrl(object, DEFAULT_OPTIONS);
