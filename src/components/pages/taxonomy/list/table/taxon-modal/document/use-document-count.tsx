import { useEffect, useState } from "react";

import { axGetListData } from "@/services/document.service";

export default function useDocsCount(taxon) {
  const [count, setCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (taxon) => {
    setIsLoading(true);

    const { success, data } = await axGetListData({
      taxon
    });

    if (success) {
      setCount(data.totalCount);
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
