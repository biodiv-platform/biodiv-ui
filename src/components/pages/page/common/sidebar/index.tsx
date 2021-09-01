import { Button, Collapse, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import styled from "@emotion/styled";
import LockIcon from "@icons/lock";
import MenuIcon from "@icons/menu";
import UnlockIcon from "@icons/unlock";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import SidebarEditing from "./sidebar-editing";
import SidebarNormal from "./sidebar-normal";
import usePagesSidebar from "./use-pages-sidebar";

const TreeContainer = styled.div`
  padding-bottom: 1rem;
  .rst__rowWrapper {
    padding: 0.25rem 0;
  }
  .rst__rowLabel {
    padding: 0;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .rst__rowTitle {
    font-weight: normal;
  }
  .rst__rowContents,
  .rst__moveHandle {
    box-shadow: none;
    border: 0;
    padding: 0;
  }
  .rst__row {
    border: 1px solid var(--chakra-colors-gray-400);
    border-radius: 0.25rem;
  }
  .rst__moveHandle {
    width: 26px;
    background-size: 40px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='currentColor' style='display:inline-block;vertical-align:text-bottom'%3E%3Cpath fill-rule='evenodd' d='M10 13a1 1 0 100-2 1 1 0 000 2zm-4 0a1 1 0 100-2 1 1 0 000 2zm1-5a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm1-5a1 1 0 11-2 0 1 1 0 012 0zM6 5a1 1 0 100-2 1 1 0 000 2z'%3E%3C/path%3E%3C/svg%3E")
      no-repeat center;
  }
  .rst__rowContents {
    min-width: initial;
    width: 216px;
    overflow: hidden;
    background: none;
    cursor: pointer;
  }
  .rst__rowContentsDragDisabled {
    padding-left: 0.5rem;
  }
  .rst__lineChildren::after {
    height: 5px;
  }
`;

export default function PagesSidebar() {
  const p = usePagesSidebar();
  const { t } = useTranslation();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const { isOpen, onToggle } = useDisclosure();

  return p.pages.length > 0 ? (
    <TreeContainer className="fade">
      {!isDesktop && (
        <Button colorScheme="blue" w="full" mb={4} onClick={onToggle} leftIcon={<MenuIcon />}>
          {t("page:sidebar.toggle")}
        </Button>
      )}
      <Collapse in={isDesktop || isOpen} unmountOnExit={true}>
        {p.canEdit && (
          <Button
            mb={3}
            w="full"
            variant="ghost"
            colorScheme={p.isEditing ? "red" : "blue"}
            rightIcon={p.isEditing ? <UnlockIcon /> : <LockIcon />}
            onClick={p.toggleEditing}
          >
            {t("page:sidebar.reorder")}
          </Button>
        )}
        {p.isEditing ? <SidebarEditing /> : <SidebarNormal />}
      </Collapse>
    </TreeContainer>
  ) : null;
}
