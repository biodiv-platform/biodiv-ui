import { IconButton } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import React from "react";

interface SimpleActionButtonProps {
  icon;
  title;
  onClick?;
  colorScheme?;
}

const SimpleActionButton = ({ icon, title, onClick, colorScheme }: SimpleActionButtonProps) => (
  <Tooltip title={title} placement="bottom">
    <IconButton
      size="lg"
      isRound={true}
      variant="ghost"
      colorScheme={colorScheme || "blue"}
      icon={icon}
      aria-label={title}
      onClick={onClick}
    />
  </Tooltip>
);

export default SimpleActionButton;
