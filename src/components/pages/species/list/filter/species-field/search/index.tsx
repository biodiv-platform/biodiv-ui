import { Flex } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import React from "react";
import { LuInfo } from "react-icons/lu";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import TextFilterInput from "./input";

export default function TextFilterPanel({ filterKey, label, childHeader, path }) {
  return (
    <AccordionItem value={filterKey}>
      <AccordionItemTrigger>
        <Flex mr={3} flex={1} justifyContent="space-between" alignItems="center" textAlign="left">
          {label}
          {childHeader?.length > 0 && (
            <Tooltip
              title={childHeader.join(", ")}
              positioning={{ placement: "top-start" }}
              // shouldWrapChildren={true}
              showArrow={true}
            >
              <LuInfo color="gray.600" />
            </Tooltip>
          )}
        </Flex>
      </AccordionItemTrigger>
      <AccordionItemContent>
        <TextFilterInput filterKey={filterKey} path={path} label={label} />
      </AccordionItemContent>
    </AccordionItem>
  );
}
