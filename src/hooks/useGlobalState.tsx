import { UserGroupIbp } from "@interfaces/observation";
import { User } from "@interfaces/user";
import React, { createContext, useContext, useEffect, useState } from "react";

interface GlobalStateContextProps {
  user?: User;
  setUser;
  isLoggedIn: boolean;

  groups?: UserGroupIbp[];

  currentGroup?: UserGroupIbp;
  isCurrentGroupMember?: boolean;
  setIsCurrentGroupMember;

  pages?;
}

interface GlobalStateProviderProps {
  initialState;
  children;
}

const GlobalStateContext = createContext<GlobalStateContextProps>({} as GlobalStateContextProps);

export const GlobalStateProvider = ({ initialState, children }: GlobalStateProviderProps) => {
  const [user, setUser] = useState(initialState.user || {});
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialState?.user?.id);
  const [isCurrentGroupMember, setIsCurrentGroupMember] = useState(
    initialState.isCurrentGroupMember
  );

  useEffect(() => {
    setIsLoggedIn(!!user?.id);
  }, [user]);

  return (
    <GlobalStateContext.Provider
      value={{
        ...initialState,
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
