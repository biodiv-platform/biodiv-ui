import * as Yup from "yup";

// shares common validation schema for add and edit gallery slider
export const galleryFieldValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  customDescripition: Yup.string(),
  fileName: Yup.string().when("$isVertical", {
    is: false,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  observationId: Yup.number().nullable(),
  moreLinks: Yup.string().when("readMoreUIType", {
    is: (value) => value && value !== "none",
    then: (schema) =>
      schema.required("Show page link is required when readMore UI type is not none"),
    otherwise: (schema) => schema.notRequired().nullable()
  }),
  options: Yup.array().nullable(),
  truncated: Yup.boolean()
});
