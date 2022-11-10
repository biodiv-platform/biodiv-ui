import { sanitizeUrl } from "@braintree/sanitize-url";
import { DEFAULT_BIB_FIELDS_SCHEMA } from "@static/document";
import request from "follow-redirects";
import * as Yup from "yup";

export const getBibFieldsMeta = (fields) => {
  const { "item type": _1, file, ...bibFieldsSchema } = fields;

  return {
    schema: Object.entries(bibFieldsSchema).reduce(
      (schema, [key, value]) => (value ? { ...schema, [key]: Yup.string().required() } : schema),
      DEFAULT_BIB_FIELDS_SCHEMA
    ),
    fields: bibFieldsSchema
  };
};

export const getDocumentURL = (document) => {
  const _url = document?.uFile?.path || document?.document?.externalUrl || document?.document?.url;

  return _url ? sanitizeUrl(_url) : null;
};

export const isLinkPDF = async (url) => {
  if (url === null) return false;
  // if url endsWith `.pdf` then it's pdf
  if (url.endsWith(".pdf")) return true;

  // else link should be valid external url
  if (!url.startsWith("http")) return false;

  const httpx = url.startsWith("https") ? request.https : request.http;

  return new Promise((resolve) => {
    try {
      // here it will verify from response headers that given url is pdf or not
      httpx.get(url, async (stream) => {
        resolve(stream.headers["content-type"] === "application/pdf");
      });
    } catch (e) {
      console.error(e);
      resolve(false);
    }
  });
};
