import useGlobalState from "@hooks/use-global-state";
import { Role } from "@interfaces/custom";
import { axGetTree, axUpdateTree } from "@services/pages.service";
import { hasAccess } from "@utils/auth";
import notification from "@utils/notification";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toggleExpandedForAll } from "react-sortable-tree";

interface GlobalStateContextProps {
  pages;
  setPages;

  isEditing;
  toggleEditing;
  canEdit;

  isLoading;
  currentPage;
}

interface UsePagesSidebarProviderProps {
  initialPages?;
  currentPage;
  children;
}

const GlobalStateContext = createContext<GlobalStateContextProps>({} as GlobalStateContextProps);

export const UsePagesSidebarProvider = ({
  initialPages,
  currentPage,
  children
}: UsePagesSidebarProviderProps) => {
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
      notification("Order Updated Successfully");
    }
    setIsLoading(false);
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <GlobalStateContext.Provider
      value={{
        pages,
        currentPage,
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
