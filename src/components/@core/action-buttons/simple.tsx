import { IconButton } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import React from "react";

interface SimpleActionButtonProps {
  icon;
  title;
  onClick?;
  colorPalette?;
}

const SimpleActionButton = ({ icon, title, onClick, colorPalette }: SimpleActionButtonProps) => (
  <Tooltip title={title} positioning={{ placement: "bottom" }}>
    <IconButton
      size="lg"
      rounded={"full"}
      variant="ghost"
      colorPalette={colorPalette || "blue"}
      aria-label={title}
      onClick={onClick}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

export default SimpleActionButton;
