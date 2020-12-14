import { axGetListData } from "@services/observation.service";
import { useEffect, useState } from "react";

export default function useObsListData() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ species: any[]; stats: any[] }>();

  const fetchData = async () => {
    setIsLoading(true);
    const { data } = await axGetListData({});
    const speciesData = data.aggregationData.groupSpeciesName;
    setData({
      species: Object.keys(speciesData),
      stats: Object.values(speciesData)
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, ...data };
}
