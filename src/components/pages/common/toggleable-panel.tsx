import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Collapse, IconButton, useDisclosure } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";

interface ToggleablePanelProps {
  id?;
  icon?: string;
  title?: string;
  options?;
  children;
}

export default function ToggleablePanel({
  id,
  icon,
  title,
  options,
  children
}: ToggleablePanelProps) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { t } = useTranslation();

  return (
    <Box id={id} className="white-box" mb={4}>
      <BoxHeading styles={{ justifyContent: "space-between", paddingRight: 0 }}>
        <div>
          {icon} {title}
        </div>
        <div>
          {options}
          <IconButton
            aria-label={t("common:toggle")}
            variant="ghost"
            size="lg"
            onClick={onToggle}
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          />
        </div>
      </BoxHeading>
      <Collapse in={isOpen} animateOpacity={true} children={children} />
    </Box>
  );
}
