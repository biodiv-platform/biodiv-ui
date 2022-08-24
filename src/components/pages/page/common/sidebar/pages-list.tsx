import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, useBoolean } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React, { useMemo } from "react";

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
  const { currentPage, linkType } = usePages();
  const [isExpanded, setIsExpanded] = useBoolean(true);
  const [hasChildren, isActive] = useMemo(
    () => [page.children.length > 0, currentPage?.id === page.id],
    [page, currentPage]
  );

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
