import { ShowActivityIbp } from "@interfaces/activity";
import { axListActivity } from "@services/activity.service";
import { Action, action, createComponentStore, Thunk, thunk } from "easy-peasy";

interface IActivityStore {
  offset: number;
  hasMore: boolean;
  loading: boolean;
  commentCount: number;

  activity: ShowActivityIbp[];
  setActivity: Action<IActivityStore, any>;
  listActivity: Thunk<IActivityStore, { objectType: string; objectId; reset?: boolean }>;
  clearActivity: Action<IActivityStore>;
}

const activityStore: IActivityStore = {
  offset: 0,
  hasMore: false,
  loading: false,
  commentCount: 0,

  activity: [],
  setActivity: action((state, { success, data, reset, offset, hasMore, commentCount }) => {
    if (success) {
      state.activity = reset ? data : [...state.activity, ...data];
      state.commentCount = commentCount;
      state.offset = offset;
      state.hasMore = hasMore;
    }
  }),
  listActivity: thunk(async (actions, { objectType, objectId, reset }, helpers) => {
    const offset = reset ? 0 : helpers.getState().offset;
    const response = await axListActivity(objectType, objectId, offset);
    // console.log("the commet data is",response)
    actions.setActivity(response);
  }),
  clearActivity: action((state) => {
    state.activity = [];
    state.offset = 0;
    state.hasMore = false;
  })
};

export const useActivityStore = createComponentStore(activityStore);
