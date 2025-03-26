import { Button, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import styled from "@emotion/styled";
import MenuIcon from "@icons/menu";
import { generateToC } from "@utils/pages";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";

import { PopoverRoot } from "@/components/ui/popover";

import usePages from "../../common/sidebar/use-pages-sidebar";

const ToCContainer = styled.div`
  ul {
    margin-left: 1rem;
    list-style-type: none;
  }
  & > ul {
    margin: 0.2rem 0;
  }
  a {
    display: block;
    padding: 0.5rem 0.65rem;
    border-radius: 0.25rem;
    line-height: 1.2rem;
    min-height: 2.2rem;
    &:hover {
      background: var(--chakra-colors-gray-100);
    }
  }
`;

export function TableOfContents() {
  const { currentPage } = usePages();
  const { t } = useTranslation();
  const showToC = useMemo(() => currentPage.content.includes("<h"), [currentPage.content]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    showToC && generateToC(".article", ".toc");
  }, [currentPage]);

  return showToC ? (
    <PopoverRoot
      open={isOpen}
      onOpenChange={() => setIsOpen(true)}
      positioning={{ placement: "bottom-start" }}
    >
      <PopoverTrigger>
        <Button variant="outline" size="sm" colorScheme="gray" bg="white" fontWeight={"bold"}>
          <MenuIcon />
          {t("page:quick_navigation")}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody maxH="20rem" overflow="auto" onClick={() => setIsOpen(false)}>
          <ToCContainer className="toc" />
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  ) : null;
}
