import * as Yup from "yup";

// shares common validation schema for add and edit gallery slider
export const galleryFieldValidationSchema = Yup.object().shape({
  title: Yup.string().required(),
  customDescripition: Yup.string(),
  fileName: Yup.string().required(),
  observationId: Yup.number().nullable(),
  moreLinks: Yup.string().required(),
  options: Yup.array().nullable()
});
