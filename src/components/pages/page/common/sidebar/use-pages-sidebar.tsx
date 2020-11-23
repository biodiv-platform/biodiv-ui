import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { Role } from "@interfaces/custom";
import { axGetTree, axUpdateTree } from "@services/pages.service";
import { hasAccess } from "@utils/auth";
import notification from "@utils/notification";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toggleExpandedForAll } from "react-sortable-tree";

interface GlobalStateContextProps {
  pages;
  setPages;
  linkType;

  isEditing;
  toggleEditing;
  canEdit;

  isLoading;
  currentPage;
}

interface UsePagesSidebarProviderProps {
  initialPages?;
  linkType: "edit" | "show";
  currentPage?;
  children;
}

const GlobalStateContext = createContext<GlobalStateContextProps>({} as GlobalStateContextProps);

export const UsePagesSidebarProvider = ({
  initialPages,
  linkType,
  currentPage,
  children
}: UsePagesSidebarProviderProps) => {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();
  const [pages, setPages] = useState(initialPages || []);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isEditing, setIsEditing] = useState<boolean>();
  const canEdit = hasAccess([Role.Admin]);

  useEffect(() => {
    axGetTree(currentGroup?.id).then(({ data: treeData }) =>
      setPages(toggleExpandedForAll({ treeData }))
    );
  }, []);

  useEffect(() => {
    if (isEditing && pages.length) {
      savePages();
    }
  }, [pages]);

  const savePages = async () => {
    setIsLoading(true);
    const { success } = await axUpdateTree(pages);
    if (success) {
      notification(t("PAGE.SIDEBAR.UPDATED"));
    }
    setIsLoading(false);
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <GlobalStateContext.Provider
      value={{
        pages,
        currentPage,
        linkType,
        isEditing,
        toggleEditing,
        canEdit,
        setPages,
        isLoading
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default function usePagesSidebar() {
  return useContext(GlobalStateContext);
}
