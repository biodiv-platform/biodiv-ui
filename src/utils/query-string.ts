import queryString, { ParseOptions } from "query-string";

const DEFAULT_OPTIONS: ParseOptions = {
  arrayFormat: "comma",
  parseNumbers: true,
  parseBooleans: true
};

export const stringify = (object: Record<string, any>) =>
  queryString.stringify(object, DEFAULT_OPTIONS);

export const parse = (object: string, arrayFields?: string[]) => {
  const parsed = queryString.parse(object, DEFAULT_OPTIONS);

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

export const parseUrl = (object: string) =>
  queryString.parseUrl(object, DEFAULT_OPTIONS);