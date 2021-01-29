import * as Yup from "yup";

export const META_BIB_FIELDS = [
  "journal",
  "booktitle",
  "author",
  "year",
  "month",
  "volume",
  "number",
  "pages",
  "publisher",
  "school",
  "edition",
  "series",
  "address",
  "chapter",
  "note",
  "type",
  "editor",
  "organization",
  "howpublished",
  "institution",
  "doi",
  "url",
  "language",
  "isbn",
  "extra",
  "file"
];

export const DEFAULT_BIB_FIELDS_SCHEMA = {
  abstract: Yup.string().nullable(),
  address: Yup.string().nullable(),
  author: Yup.string().nullable(),
  booktitle: Yup.string().nullable(),
  chapter: Yup.string().nullable(),
  doi: Yup.string().nullable(),
  edition: Yup.string().nullable(),
  editor: Yup.string().nullable(),
  extra: Yup.string().nullable(),
  file: Yup.string().nullable(),
  howpublished: Yup.string().nullable(),
  institution: Yup.string().nullable(),
  isbn: Yup.string().nullable(),
  journal: Yup.string().nullable(),
  language: Yup.string().nullable(),
  month: Yup.string().nullable(),
  note: Yup.string().nullable(),
  number: Yup.string().nullable(),
  organization: Yup.string().nullable(),
  pages: Yup.string().nullable(),
  publisher: Yup.string().nullable(),
  school: Yup.string().nullable(),
  series: Yup.string().nullable(),
  title: Yup.string().required(),
  type: Yup.string().nullable(),
  url: Yup.string().nullable(),
  volume: Yup.string().nullable(),
  year: Yup.string().nullable()
};

export const DEFAULT_BIB_FIELDS = {
  abstract: false,
  title: true
};

export const DOUCMENT_FILTER_KEY = {
  itemType: {
    filterkey: "itemType",
    searchKey: "document.itemtype"
  },
  author: {
    filterKey: "author",
    searchKey: "document.author"
  },
  publisher: {
    filterKey: "publisher",
    searchKey: "document.publisher"
  },

  tags: {
    filterKey: "tags",
    searchKey: "tags.name"
  },

  title: {
    filterKey: "title",
    searchKey: "document.title"
  }
};
