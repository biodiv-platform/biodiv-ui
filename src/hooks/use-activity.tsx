import { axListActivity } from "@services/activity.service";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

export default function useActivity(resourceId, resourceType) {
  const [isLoading, setIsLoading] = useState<boolean>();

  const [activity, setActivity] = useImmer({
    offset: 0,
    hasMore: false,
    commentCount: 0,
    list: []
  });

  const loadMore = async (resourceType, resourceId, reset?) => {
    setIsLoading(true);
    const r = await axListActivity(resourceType, resourceId, reset ? 0 : activity.offset);
    if (r.success) {
      setActivity((_draft: any) => {
        if (reset) {
          _draft.list = r.data;
        } else {
          _draft.list.push(...r.data);
        }
        _draft.offset = r.offset;
        _draft.hasMore = r.hasMore;
        _draft.commentCount = r.commentCount;
      });
    }
    setIsLoading(false);
  };

  const refreshActivityList = () => loadMore(resourceType, resourceId, true);

  useEffect(() => {
    refreshActivityList();
  }, []);

  return { data: activity, isLoading, loadMore, refresh: refreshActivityList };
}
