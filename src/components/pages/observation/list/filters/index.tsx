import {
  Button,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Heading,
  Stack,
  useDisclosure
} from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import React from "react";

import FiltersList from "./list";
import ClearFilters from "./taxon-browser/clear-filters";

const FilterWrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
  border-right: 1px solid var(--gray-300);
  min-width: 18rem;

  .toggle-button {
    display: none;
  }

  [data-accordion-item] {
    [data-accordion-panel] {
      padding: 0.75rem;
    }

    > button[aria-expanded="true"] {
      background: var(--gray-100);
    }

    > button > div {
      display: flex;
      flex: 1;
    }
  }

  ${Mq.max.md} {
    .toggle-button {
      display: initial;
    }
    .hidden-mobile {
      display: none;
    }
  }
`;

export default function Filters() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation();

  return (
    <>
      <FilterWrapper>
        <Button w="full" className="toggle-button" onClick={onToggle}>
          {t("FILTERS.TOGGLE")}
        </Button>
        <div className={"hidden-mobile"}>
          <Stack m={4} isInline={true} align="center" justify="space-between">
            <Heading size="md">{t("FILTERS.TITLE")}</Heading>
            <ClearFilters />
          </Stack>
          <FiltersList />
        </div>
      </FilterWrapper>
      <Drawer onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <BoxHeading>Filters</BoxHeading>
          <FiltersList />
        </DrawerContent>
      </Drawer>
    </>
  );
}
