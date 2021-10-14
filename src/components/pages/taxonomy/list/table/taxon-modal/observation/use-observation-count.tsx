import { axGetListData } from "@services/observation.service";
import { useEffect, useState } from "react";

export default function useObsCount(taxon) {
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
