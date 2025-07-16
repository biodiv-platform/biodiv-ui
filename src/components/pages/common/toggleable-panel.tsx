import { Box, Collapsible, IconButton, useDisclosure } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

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
  const { open, onToggle } = useDisclosure({ defaultOpen: true });
  const { t } = useTranslation();

  return (
    <Box id={id} className="white-box" mb={4}>
      <BoxHeading styles={{ justifyContent: "space-between", paddingRight: 0 }}>
        <div>
          {icon} {title}
        </div>
        <div>
          {options}
          <IconButton aria-label={t("common:toggle")} variant="ghost" size="lg" onClick={onToggle}>
            {open ? <LuChevronUp /> : <LuChevronDown />}
          </IconButton>
        </div>
      </BoxHeading>
      {/* animateOpacity={true} */}
      <Collapsible.Root open={open}>
        <Collapsible.Content children={children}></Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
