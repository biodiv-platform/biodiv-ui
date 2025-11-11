import queryString, { ParseOptions, StringifyOptions } from "query-string";

// extends existing `query-string` package and sets below option by default
const DEFAULT_OPTIONS: ParseOptions & StringifyOptions = {
  arrayFormat: "comma",
  parseNumbers: true,
  parseBooleans: true
};

export const stringify = (object: Record<string, any>): string =>
  queryString.stringify(object, DEFAULT_OPTIONS);

export const parse = (object: string, arrayFields?: string[]): Record<string, any> => {
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

export const parseUrl = (url: string): { url: string; query: Record<string, any> } =>
  queryString.parseUrl(url, DEFAULT_OPTIONS);
