import { axGetDocumentDataByTaxonId } from "@services/document.service";
import { useEffect, useState } from "react";

export default function useDocumentCount(taxon) {
  const [count, setCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (taxon) => {
    setIsLoading(true);

    console.log("taxn=", taxon);

    const { success, data } = await axGetDocumentDataByTaxonId(taxon);

    if (success) {
      console.log(data);
      setCount(data.length);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData(taxon);
  }, []);

  return {
    countsData: { value: count, isLoading: isLoading }
  };
}
