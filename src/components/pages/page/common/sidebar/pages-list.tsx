import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, useBoolean } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import LocalLink, { useLocalRouter } from "@components/@core/local-link";
import EditIcon from "@icons/edit";
import { axDeletePageByID } from "@services/pages.service";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import { PAGE_TYPES } from "../data";
import usePages from "./use-pages-sidebar";

interface PagesListProps {
  items;
  isParent?;
}

const TogglePaneButton = ({ isExpanded, onToggle }) => (
  <Button variant="ghost" fontSize="xl" colorScheme="transparent" onClick={onToggle} pl={0}>
    {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
  </Button>
);

const PagesListItem = ({ page, isParent }) => {
  const { currentPage, linkType, canEdit } = usePages();
  const [isExpanded, setIsExpanded] = useBoolean(true);
  const [hasChildren, isActive] = useMemo(
    () => [page.children.length > 0, currentPage?.id === page.id],
    [page, currentPage]
  );
  const router = useLocalRouter();
  const { t } = useTranslation();
  const handleOnEdit = () => router.push(`/page/edit/${page.id}`, true);

  return (
    <div>
      <Box
        rounded="md"
        bg={isActive ? "blue.100" : "none"}
        _hover={isActive ? {} : { bg: "gray.200" }}
        display="flex"
        transition="all 0.2s"
        alignItems="center"
        justifyContent="space-between"
        fontWeight={isParent ? "semibold" : "normal"}
        mb={2}
      >
        <LocalLink prefixGroup={true} href={`/page/${linkType}/${page.id}`}>
          <chakra.a flexGrow={1} pl={3} py={2}>
            {!isParent && <chakra.span opacity={0.5} mr={3} children="#" />}
            {page.title}
          </chakra.a>
        </LocalLink>

        {canEdit && page.pageType == PAGE_TYPES.REDIRECT && linkType == "show" && (
          <>
            <SimpleActionButton
              icon={<EditIcon />}
              title={t("common:edit")}
              onClick={handleOnEdit}
              colorScheme="teal"
            />
            <DeleteActionButton
              observationId={page.id}
              title={t("page:remove.title")}
              description={t("page:remove.description")}
              deleted={t("page:remove.success")}
              deleteFunc={axDeletePageByID}
            />
          </>
        )}

        {hasChildren && (
          <TogglePaneButton isExpanded={isExpanded} onToggle={setIsExpanded.toggle} />
        )}
      </Box>
      {isExpanded && hasChildren && <PagesList items={page.children} key={page.id} />}
    </div>
  );
};

export const PagesList = ({ items, isParent }: PagesListProps) => (
  <Box ml={isParent ? 0 : 3}>
    {items.map((page) => (
      <PagesListItem page={page} key={page.id} isParent={isParent} />
    ))}
  </Box>
);
