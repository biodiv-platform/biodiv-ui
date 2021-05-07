import React, { createContext, useContext, useState } from "react";

interface SpeciesFieldsContextProps {
  showHiddenFields;
  toggleHiddenFields;
}

interface SpeciesFieldsProviderProps {
  children;
}

const SpeciesFieldsContext = createContext<SpeciesFieldsContextProps>(
  {} as SpeciesFieldsContextProps
);

export const SpeciesFieldsProvider = ({ children }: SpeciesFieldsProviderProps) => {
  const [showHiddenFields, setShowHiddenFields] = useState<boolean>();

  const toggleHiddenFields = () => setShowHiddenFields(!showHiddenFields);

  return (
    <SpeciesFieldsContext.Provider
      value={{
        showHiddenFields,
        toggleHiddenFields
      }}
    >
      {children}
    </SpeciesFieldsContext.Provider>
  );
};

export default function useSpeciesFields() {
  return useContext(SpeciesFieldsContext);
}
