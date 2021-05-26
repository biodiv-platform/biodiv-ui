import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import { axCheckSpecies, axCreateSpecies } from "@services/species.service";
import notification from "@utils/notification";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SpeciesCreateContextProps {
  isLoading;
  setIsLoading;

  taxonRanks;
  setTaxonRanks;
  selectedTaxon;
  setSelectedTaxon;
  validationParams;
  setValidationParams;

  validateResponse;
  setValidateResponse;

  taxonRanksMeta;
}

interface SpeciesCreateProviderProps {
  taxonRanksMeta;
  children;
}

const SpeciesCreateContext = createContext<SpeciesCreateContextProps>(
  {} as SpeciesCreateContextProps
);

export const SpeciesCreateProvider = ({ taxonRanksMeta, children }: SpeciesCreateProviderProps) => {
  const router = useLocalRouter();
  const { t } = useTranslation();

  const [validateResponse, setValidateResponse] = useState();
  const [selectedTaxon, setSelectedTaxon] = useState<any>();
  const [taxonRanks, setTaxonRanks] = useState();
  const [validationParams, setValidationParams] = useState();
  const [isLoading, setIsLoading] = useState();

  const checkSpecies = async () => {
    // Check if taxonId is associated with species page
    const { success, data } = await axCheckSpecies(selectedTaxon.id);

    if (success) {
      let speciesId = data;

      // if taxon does not have species page then create one
      if (!speciesId) {
        const { success, data } = await axCreateSpecies({
          taxonConceptId: selectedTaxon.id,
          title: selectedTaxon.name
        });

        if (success) {
          speciesId = data;
        } else {
          notification(t("SPECIES.CREATE.ERROR"));
          return;
        }
      }

      // Redirect to Species Page
      router.push(`/species/show/${speciesId}`, true);
    } else {
      notification(t("SPECIES.CREATE.ERROR"));
    }
  };

  useEffect(() => {
    selectedTaxon && checkSpecies();
  }, [selectedTaxon]);

  return (
    <SpeciesCreateContext.Provider
      value={{
        isLoading,
        setIsLoading,

        validateResponse,
        setValidateResponse,

        taxonRanks,
        setTaxonRanks,

        selectedTaxon,
        setSelectedTaxon,

        validationParams,
        setValidationParams,

        taxonRanksMeta
      }}
    >
      {children}
    </SpeciesCreateContext.Provider>
  );
};

export default function useSpeciesCreate() {
  return useContext(SpeciesCreateContext);
}
