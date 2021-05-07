/**
 * This function creates references that can be rendered directly
 * It has a function inside function so flat list can be generated easily
 *
 * @param {*} fieldData
 * @return {*}
 */
export const generateReferencesList = (fieldData): any[] => {
  const references = {};

  const generateReferenceNodes = (fieldList, path = [] as any) => {
    fieldList.map((field) => {
      const newPath = [...path, field.parentField.header];
      const pathString = newPath.join(" > ");
      field.parentField.values.map((v) => {
        if (!references[pathString]) {
          references[pathString] = [];
        }
        const newReferences = v.references.map((r) => [r.title, r.url]);
        references[pathString] = [...references[pathString], ...newReferences];
      });
      generateReferenceNodes(field.childField, newPath);
    });
  };
  generateReferenceNodes(fieldData);

  return Object.entries(references).filter((o: any) => o[1].length > 0);
};
