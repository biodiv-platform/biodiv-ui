import { UserGroupIbp } from "@interfaces/observation";
import { axGetTree } from "@services/pages.service";
import { axCheckUserGroupMember } from "@services/usergroup.service";
import { AUTHWALL } from "@static/events";
import { getParsedUser } from "@utils/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useListener } from "react-gbus";

interface GlobalStateContextProps {
  user?;
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
  const [user, setUser] = useState<any>(initialState.user || {});
  const [pages, setPages] = useState<any[]>([]);
  const [isCurrentGroupMember, setIsCurrentGroupMember] = useState<boolean>();

  const isLoggedIn = useMemo(() => !!user.id, [user]);

  const fetchIsCurrentGroupMember = async () => {
    if (!isLoggedIn) return;

    const isCurrentGroupMember = await axCheckUserGroupMember(initialState.currentGroup?.id);
    setIsCurrentGroupMember(isCurrentGroupMember);
  };

  useEffect(() => {
    fetchIsCurrentGroupMember();
  }, [initialState.currentGroup, user]);

  useEffect(() => {
    axGetTree(initialState.currentGroup?.id).then(({ data }) => setPages(data));
  }, [initialState.currentGroup?.id]);

  useListener(() => {
    setUser(getParsedUser());
  }, [AUTHWALL.SUCCESS]);

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
