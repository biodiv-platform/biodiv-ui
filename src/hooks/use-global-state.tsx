import { UserGroupIbpExtended } from "@interfaces/custom";
import { axCheckUserGroupMember } from "@services/app.service";
import { axGetTree } from "@services/app.service";
import { AUTHWALL } from "@static/events";
import { getParsedUser } from "@utils/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useListener } from "react-gbus";
import { useDeepCompareMemo } from "use-deep-compare";

interface GlobalStateContextProps {
  user?;
  setUser;
  isLoggedIn: boolean;

  groups?: UserGroupIbpExtended[];

  currentGroup: UserGroupIbpExtended;
  isCurrentGroupMember?: boolean;
  setIsCurrentGroupMember;
  languageId?;

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
    axGetTree({
      userGroupId: initialState.currentGroup?.id,
      languageId: initialState.languageId
    }).then(({ data }) => setPages(data));
  }, [initialState.currentGroup?.id, initialState.languageId]);

  useListener(() => {
    setUser(getParsedUser());
  }, [AUTHWALL.SUCCESS]);

  const value = {};

  // to avoid unnecessary re-renders
  const valueMemo = useDeepCompareMemo(
    () => ({
      groups: initialState.groups,
      currentGroup: initialState.currentGroup,
      isCurrentGroupMember,
      setIsCurrentGroupMember,

      pages,
      setPages,

      user,
      setUser,
      isLoggedIn,

      languageId: initialState.languageId
    }),
    [value, initialState, pages, user, isLoggedIn, isCurrentGroupMember, initialState.languageId]
  );

  return <GlobalStateContext.Provider value={valueMemo}>{children}</GlobalStateContext.Provider>;
};

export default function useGlobalState() {
  return useContext(GlobalStateContext);
}
