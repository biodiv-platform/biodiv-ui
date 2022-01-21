/**
 * extracts header(s) from species.fieldData
 */
export const getSpeciesFieldHeaders = (fieldData) => {
  return fieldData
    .filter((o) => o.childField.length)
    .map(({ parentField, childField }) => ({
      ...parentField,
      childHeader: childField?.map(({ parentField }) => parentField?.header)
    }));
};

/**
 * @warning CONTAINS HACKY FUNCTIONS once done ask back-end to impliment according to clean payload
 */
export const normalizeSpeciesPayload = (fieldsMeta, traitsMeta, speciesData, speciesGroupData) => {
  const { fieldData: fieldsData, facts: traitsData, taxonomyDefinition } = speciesData;

  /**
   * TRAITS: restructure and merge with values
   */
  const traitsMeta_1: any[] = [];

  traitsMeta.map((o) => {
    traitsMeta_1.push(...o.traitsValuePairList);
  });

  const traitsMeta_2 = traitsMeta_1.map(({ traits, values: options }) => {
    const values = traitsData.filter((o) => o.nameId === traits.id);
    return { ...traits, options, values };
  });

  /**
   * - fixes some keys containing `childFields` and others `childField`
   * - filters empty parent category
   */
  const fieldsMeta_1 = JSON.parse(
    JSON.stringify(fieldsMeta).replace(/childFields/g, "childField")
  ).filter((o) => o.childField.length);

  /**
   * - dumb way fixed last direct node instead of parentField and childField way
   */
  const fieldsMeta_2 = fieldsMeta_1.map((o) =>
    o.childField.length
      ? {
          ...o,
          childField: o.childField.map((o1) =>
            o1.childField.length
              ? {
                  ...o1,
                  childField: o1.childField.map((o2) => ({ parentField: o2, childField: [] }))
                }
              : o1
          )
        }
      : o
  );
  const fieldsMeta_3 = assignFieldDataToMeta(fieldsMeta_2, fieldsData);
  const fieldsMeta_4 = assignTraitsToFieldMeta(fieldsMeta_3, traitsMeta_2);

  return {
    ...speciesData,
    fieldData: fieldsMeta_4,
    currentSpeciesGroup:
      speciesGroupData.find((o) => o.id === taxonomyDefinition?.groupId)?.name || null,
    facts: null
  };
};

const assignFieldDataToMeta = (meta, data) => {
  return meta.map((m) => ({
    parentField: {
      ...m.parentField,
      values: data.filter((d) => d.fieldId === m.parentField.id && d.fieldData.description) // matches id and removes empty fields
    },
    childField: m.childField.length ? assignFieldDataToMeta(m.childField, data) : m.childField
  }));
};

const assignTraitsToFieldMeta = (meta, data) => {
  return meta.map((m) => ({
    parentField: {
      ...m.parentField,
      traits: data.filter((d) => d.fieldId === m.parentField.id)
    },
    childField: m.childField.length ? assignTraitsToFieldMeta(m.childField, data) : m.childField
  }));
};
