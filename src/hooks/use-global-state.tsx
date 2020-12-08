import { UserGroupIbp } from "@interfaces/observation";
import { User } from "@interfaces/user";
import { axGetTree } from "@services/pages.service";
import { AUTHWALL } from "@static/events";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useListener } from "react-gbus";

interface GlobalStateContextProps {
  user?: User;
  setUser;
  isLoggedIn: boolean;

  groups?: UserGroupIbp[];

  currentGroup: UserGroupIbp;
  isCurrentGroupMember?: boolean;
  setIsCurrentGroupMember;

  pages?;
  setPages?;
}

interface GlobalStateProviderProps {
  initialState;
  children;
}

const GlobalStateContext = createContext<GlobalStateContextProps>({} as GlobalStateContextProps);

export const GlobalStateProvider = ({ initialState, children }: GlobalStateProviderProps) => {
  const [user, setUser] = useState(initialState.user || {});
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialState?.user?.id);
  const [pages, setPages] = useState<any[]>([]);
  const [isCurrentGroupMember, setIsCurrentGroupMember] = useState(
    initialState.isCurrentGroupMember
  );

  useEffect(() => {
    axGetTree(initialState.currentGroup?.id).then(({ data }) => setPages(data));
  }, [initialState.currentGroup?.id]);

  useEffect(() => {
    setIsLoggedIn(!!user?.id);
  }, [user]);

  useListener(setUser, [AUTHWALL.SUCCESS]);

  return (
    <GlobalStateContext.Provider
      value={{
        ...initialState,
        pages,
        setPages,
        user,
        setUser,
        isLoggedIn,
        isCurrentGroupMember,
        setIsCurrentGroupMember
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default function useGlobalState() {
  return useContext(GlobalStateContext);
}
