export const cleanTags = (tags) => {
  return (
    tags?.map(({ label: name, value = 0, version }) => ({
      id: name !== value ? value : null,
      version,
      name
    })) || []
  );
};

/**
 * Since back-end can't have dynamic types
 * This function divides payload into string and numeric array pair
 */
export const cleanFacts = (facts = {}) => {
  const factValuePairs: any = [];
  const factValueStringPairs: any = [];

  Object.entries(facts).map(([factKey, factValue]: any) => {
    if (factValue[0]) {
      if (isNaN(factValue[0])) {
        factValueStringPairs.push([factKey, factValue]);
      } else {
        factValuePairs.push([factKey, factValue.map((o) => Number(o))]);
      }
    }
  });

  return {
    factValuePairs: Object.fromEntries(factValuePairs),
    factValueStringPairs: Object.fromEntries(factValueStringPairs)
  };
};

/**
 * Same as `cleanFacts()` but for singular
 */
export const cleanSingleFact = (valueList) => {
  const factValueArray = Array.isArray(valueList) ? valueList : [valueList];
  return isNaN(factValueArray[0])
    ? { valuesString: factValueArray, traitValueList: [] }
    : { traitValueList: factValueArray, valuesString: [] };
};
