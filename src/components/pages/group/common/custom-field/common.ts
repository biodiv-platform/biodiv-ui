import * as Yup from "yup";

export const customFieldValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  notes: Yup.string().nullable(),
  units: Yup.string().nullable(),
  allowedParticipation: Yup.boolean().required(),
  isMandatory: Yup.boolean().required(),
  displayOrder: Yup.number().nullable(),
  iconURL: Yup.string().nullable(),
  dataType: Yup.string().required(),
  fieldType: Yup.string().required(),
  defaultValue: Yup.string().nullable(),
  values: Yup.lazy((value) => {
    if (value) {
      return Yup.array().of(
        Yup.object().shape({
          value: Yup.string().nullable(),
          iconURL: Yup.string().nullable(),
          notes: Yup.string().nullable()
        })
      );
    }
    return Yup.mixed().notRequired();
  })
});

export const processCFValue = (item) => {
  const { customFields: cfs, cfValues, allowedParticipation, isMandatory, ...others } = item;
  return {
    ...cfs,
    allowedParticipation: allowedParticipation ?? true,
    isMandatory: isMandatory ?? true,
    values: cfValues ? [...cfValues.map((i) => ({ value: i.values, ...i }))] : [],
    ...others
  };
};
