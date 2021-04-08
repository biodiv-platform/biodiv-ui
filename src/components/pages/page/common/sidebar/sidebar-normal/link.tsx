import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, chakra, IconButton, useDisclosure } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React from "react";

function LinkLayout({ isActive, isParent, children }) {
  return (
    <Box
      mb={2}
      rounded="md"
      bg={isActive ? "blue.100" : "none"}
      _hover={isActive ? {} : { bg: "gray.100" }}
      display="flex"
      transition="all 0.2s"
      justifyContent="space-between"
      alignItems="center"
      fontWeight={isParent ? "semibold" : "normal"}
    >
      {children}
    </Box>
  );
}

const LinkChildren = ({ page, currentPageId, linkType }) => {
  const isActive = currentPageId === page.id;

  return (
    <LinkLayout isActive={isActive} isParent={false}>
      <LocalLink prefixGroup={true} href={`/page/${linkType}/${page.id}`}>
        <chakra.a flexGrow={1} px={3} py={2} aria-current={isActive ? "page" : undefined}>
          <Box as="span" color="gray.400" mr={2}>
            #
          </Box>
          {page.title}
        </chakra.a>
      </LocalLink>
    </LinkLayout>
  );
};

export const LinkParent = ({ page, currentPageId, linkType }) => {
  const isActive = currentPageId === page.id;
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  return (
    <Box>
      <LinkLayout isActive={isActive} isParent={true}>
        <LocalLink prefixGroup={true} href={`/page/${linkType}/${page.id}`}>
          <chakra.a flexGrow={1} px={3} py={2} aria-current={isActive ? "page" : undefined}>
            {page.title}
          </chakra.a>
        </LocalLink>
        {page.children.length > 0 && (
          <IconButton
            variant="none"
            flexShrink={0}
            aria-label="Toggle Sub Pages"
            onClick={onToggle}
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          />
        )}
      </LinkLayout>
      {page.children.length > 0 && isOpen && (
        <Box pl={3} mt={2}>
          {page.children.map((page) => (
            <LinkChildren
              page={page}
              currentPageId={currentPageId}
              key={page.id}
              linkType={linkType}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
