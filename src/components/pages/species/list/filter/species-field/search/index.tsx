import { InfoIcon } from "@chakra-ui/icons";
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex
} from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import React from "react";

import TextFilterInput from "./input";

export default function TextFilterPanel({ filterKey, label, childHeader, path }) {
  return (
    <AccordionItem>
      <AccordionButton>
        <Flex mr={3} justifyContent="space-between" alignItems="center" flex={1} textAlign="left">
          {label}
          {childHeader?.length > 0 && (
            <Tooltip
              title={childHeader.toString()}
              placement="top-start"
              shouldWrapChildren={true}
              hasArrow={true}
            >
              <InfoIcon color="gray.600" />
            </Tooltip>
          )}
        </Flex>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <TextFilterInput filterKey={filterKey} path={path} label={label} />
      </AccordionPanel>
    </AccordionItem>
  );
}
