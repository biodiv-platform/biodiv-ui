import { UserGroupIbp } from "@interfaces/observation";
import { User } from "@interfaces/user";
import { AUTHWALL } from "@static/events";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useListener } from "react-gbus";

interface GlobalStateContextProps {
  user?: User;
  setUser;
  isLoggedIn: boolean;

  groups?: UserGroupIbp[];

  currentGroup?: UserGroupIbp;
  isCurrentGroupMember?: boolean;
  setIsCurrentGroupMember;
  canUserEdit?: boolean;
  setCanUserEdit;

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
  const [canUserEdit, setCanUserEdit] = useState(initialState.canUserEdit);

  useEffect(() => {
    setIsLoggedIn(!!user?.id);
  }, [user]);

  useListener(setUser, [AUTHWALL.SUCCESS]);

  return (
    <GlobalStateContext.Provider
      value={{
        ...initialState,
        user,
        setUser,
        isLoggedIn,
        isCurrentGroupMember,
        setIsCurrentGroupMember,
        canUserEdit,
        setCanUserEdit
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default function useGlobalState() {
  return useContext(GlobalStateContext);
}
