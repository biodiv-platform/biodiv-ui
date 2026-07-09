import useGlobalState from "@hooks/use-global-state";
import { axUpdateTree } from "@services/pages.service";
import { axCheckUserGroupFounderOrAdmin } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import { createContext, useContext, useEffect, useState } from "react";

interface UsePagesContextProps {
  pages;
  setPages;
  linkType;

  isEditing;
  toggleEditing;
  canEdit;
  savePages;

  isLoading;
  currentPage;
}

interface UsePagesSidebarProviderProps {
  initialPages?;
  linkType: "edit" | "show";
  currentPage?;
  children;
}

const GlobalStateContext = createContext<UsePagesContextProps>({} as UsePagesContextProps);

function expandAll<T extends { children?: T[] }>(items: T[]): T[] {
  return items.map((item) => ({
    ...item,
    collapsed: false,
    children: item.children ? expandAll(item.children) : item.children
  }));
}

export const UsePagesProvider = ({
  linkType,
  currentPage,
  children
}: UsePagesSidebarProviderProps) => {
  const { t } = useTranslation();
  const { currentGroup, pages, setPages } = useGlobalState();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isEditing, setIsEditing] = useState<boolean>();
  const [canEdit, setCanEdit] = useState(false);
  const [iPages, setIPages] = useState([]);

  useEffect(() => {
    setIPages(expandAll(pages));
  }, [pages]);

  useEffect(() => {
    axCheckUserGroupFounderOrAdmin(currentGroup.id, true).then(setCanEdit);
  }, []);

  const savePages = async () => {
    setIsLoading(true);
    const { success } = await axUpdateTree(iPages);
    setPages(iPages);
    if (success) {
      notification(t("page:sidebar.updated"), NotificationType.Success);
    }
    setIsLoading(false);
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <GlobalStateContext.Provider
      value={{
        currentPage,
        linkType,
        isEditing,
        toggleEditing,
        canEdit,
        savePages,

        pages: iPages,
        setPages: setIPages,

        isLoading
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default function usePages() {
  return useContext(GlobalStateContext);
}
