import { removeCardWrapperParagraphs } from "@utils/pages";

export const PAGE_TYPES = {
  CONTENT: "Content",
  REDIRECT: "Redirect"
};

export const PAGE_TYPE_OPTIONS = [
  {
    label: "page:form.type.content",
    value: PAGE_TYPES.CONTENT
  },
  {
    label: "page:form.type.redirect",
    value: PAGE_TYPES.REDIRECT
  }
];

export const transformPagePayload = (payload, extraProps = {}) => {
  const galleryData = payload.galleryData.map((g, idx) => ({ ...g, displayOrder: idx + 1 }));
  const resetContentKey = payload.pageType === PAGE_TYPES.REDIRECT ? "content" : "url";

  return {
    ...payload,
    galleryData,
    content: removeCardWrapperParagraphs(payload.content),
    userIbp: undefined,
    languageId: undefined,
    date: undefined,
    [resetContentKey]: "",
    ...extraProps
  };
};
