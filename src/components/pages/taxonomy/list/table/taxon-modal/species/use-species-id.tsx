import { axGetSpeciesIdFromTaxonId } from "@services/species.service";
import { useEffect, useState } from "react";

export const useSpeciesId = (taxonId) => {
  const [speciesId, setSpeciesId] = useState(null);
  const getSpeciesId = async (taxonId) => {
    const { success, data } = await axGetSpeciesIdFromTaxonId(taxonId);
    if (success) {
      setSpeciesId(data);
    }
  };

  useEffect(() => {
    getSpeciesId(taxonId);
  }, []);

  return speciesId;
};
