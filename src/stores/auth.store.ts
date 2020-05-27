import { UserGroupIbp } from "@interfaces/observation";
import { User } from "@interfaces/user";
import { Action, action, Computed, computed, createComponentStore } from "easy-peasy";

interface IAuthStore {
  user: User;
  setUser: Action<IAuthStore, User>;
  removeUser: Action<IAuthStore>;
  doLogOut: Action<IAuthStore>;
  isLoggedIn: Computed<IAuthStore>;

  groups: UserGroupIbp[];
  currentGroup: UserGroupIbp;
  setGroups: Action<IAuthStore, UserGroupIbp[]>;
}

const authStore: IAuthStore = {
  user: {},
  setUser: action((state, user) => {
    state.user = user;
  }),
  removeUser: action((state) => {
    state.user = {};
  }),
  doLogOut: action((state) => {
    state.user = {};
    state.isLoggedIn = false;
  }),
  isLoggedIn: computed((state) => (state.user?.["id"] ? true : false)),

  groups: [],
  currentGroup: {},
  setGroups: action((state, groups) => {
    state.groups = groups;
  })
};

export const useAuthStore = createComponentStore(authStore);

export default authStore;
