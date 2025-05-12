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
      if (factKey.split("|")[1] != "STRING") {
        factValueStringPairs.push([factKey.split("|")[0], factValue]);
      } else {
        factValuePairs.push([factKey.split("|")[0], factValue.map((o) => Number(o))]);
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
export const cleanSingleFact = (dataType,valueList) => {
  const factValueArray = Array.isArray(valueList) ? valueList : [valueList];
  return (dataType!="STRING")
    ? { valuesString: factValueArray, traitValueList: [] }
    : { traitValueList: factValueArray, valuesString: [] };
};
