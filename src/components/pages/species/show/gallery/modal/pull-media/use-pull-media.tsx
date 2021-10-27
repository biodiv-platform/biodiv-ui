import useSpecies from "@components/pages/species/show/use-species";
import { AssetStatus } from "@interfaces/custom";
import { axSpeciesPullResourcesList } from "@services/species.service";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

interface PullMediaProps {
  noPayloadModification?: boolean;
}

const LIMIT = 10;

export default function usePullMedia(noPayloadModification?: PullMediaProps) {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [resourcesList, setResourcesList] = useImmer({
    list: [] as any[],
    hasMore: true,
    offset: 0
  });

  const { species } = useSpecies();

  const loadMoreResources = async () => {
    setIsLoading(true);

    const { success, data } = await axSpeciesPullResourcesList(
      species.species.id,
      resourcesList.offset
    );

    if (success) {
      const dataList: any[] = [];

      data.forEach((o) =>
        o?.resourceData?.forEach((r) =>
          dataList.push(
            noPayloadModification
              ? r
              : {
                  ...r.resource,
                  caption: r.resource.description,
                  contributor: r.userIbp.name,
                  licenseId: r.resource.licenseId?.toString(),
                  hashKey: r.resource.id.toString(),
                  status: AssetStatus.Uploaded,
                  path: r.resource.fileName,
                  observationId: o.observationId
                }
          )
        )
      );

      setResourcesList((_draft) => {
        if (data.length) {
          _draft.list.push(...dataList);
          _draft.offset = _draft.offset + LIMIT;
          _draft.hasMore = true;
        } else {
          _draft.hasMore = false;
        }
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadMoreResources();
  }, []);

  return { resourcesList, loadMoreResources, isLoading };
}
