import { UserGroupIbpExtended } from "@interfaces/custom";
import { axCheckUserGroupMember } from "@services/app.service";
import { axGetTree } from "@services/app.service";
import { AUTHWALL } from "@static/events";
import { getParsedUser } from "@utils/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useListener } from "react-gbus";
import { useDeepCompareMemo } from "use-deep-compare";

import { axGetSiteInfo } from "@/services/utility.service";

interface GlobalStateContextProps {
  user?;
  setUser;
  isLoggedIn: boolean;

  groups?: UserGroupIbpExtended[];

  currentGroup: UserGroupIbpExtended;
  isCurrentGroupMember?: boolean;
  setIsCurrentGroupMember;
  languageId?;

  open?;
  setOpen?;

  announcement?;
  setAnnouncement?;

  pages?;
  setPages?;
  getPageTree?;

  siteInfo?;
  setSiteInfo?;
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
  const [open, setOpen] = useState(true);
  const [announcement, setAnnouncement] = useState(initialState.announcement || {});
  const [siteInfo, setSiteInfo] = useState(initialState.siteInfo || {});

  const isLoggedIn = useMemo(() => !!user.id, [user]);

  const fetchIsCurrentGroupMember = async () => {
    if (!isLoggedIn) return;

    const isCurrentGroupMember = await axCheckUserGroupMember(initialState.currentGroup?.id);
    setIsCurrentGroupMember(isCurrentGroupMember);
  };

  useEffect(() => {
    fetchIsCurrentGroupMember();
  }, [initialState.currentGroup, user]);

  const getPageTree = async () => {
    try {
      const { data } = await axGetTree({
        userGroupId: initialState.currentGroup?.id,
        languageId: initialState.languageId
      });
      setPages(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getPageTree();
  }, [initialState.currentGroup?.id, initialState.languageId]);

  // Fetch homeInfo when languageId or currentGroup changes
  const fetchSiteInfo = async () => {
    try {
      const languageId = initialState.languageId;

      // Fetch global home info
      const response = await axGetSiteInfo(languageId);

      setSiteInfo(response.data);
    } catch (e) {
      console.error("Error fetching home info:", e);
    }
  };

  useEffect(() => {
    fetchSiteInfo();
  }, [initialState.languageId]);

  useListener(() => {
    setUser(getParsedUser());
  }, [AUTHWALL.SUCCESS]);

  // to avoid unnecessary re-renders
  const valueMemo = useDeepCompareMemo(
    () => ({
      groups: initialState.groups,
      currentGroup: initialState.currentGroup,
      isCurrentGroupMember,
      setIsCurrentGroupMember,

      pages,
      setPages,
      getPageTree,

      user,
      setUser,
      isLoggedIn,

      languageId: initialState.languageId,

      open,
      setOpen,

      announcement,
      setAnnouncement,

      siteInfo,
      setSiteInfo
    }),
    [
      initialState.groups,
      initialState.currentGroup,
      initialState.languageId,
      pages,
      user,
      isLoggedIn,
      isCurrentGroupMember,
      open,
      announcement,
      siteInfo
    ]
  );

  return <GlobalStateContext.Provider value={valueMemo}>{children}</GlobalStateContext.Provider>;
};

export default function useGlobalState() {
  return useContext(GlobalStateContext);
}
