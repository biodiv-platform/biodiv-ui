import { IconButton } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import React from "react";

const SimpleActionButton = ({ icon, title, onClick = null, variantColor = "blue" }) => (
  <Tooltip title={title} placement="bottom">
    <IconButton
      size="lg"
      isRound={true}
      variant="ghost"
      variantColor={variantColor}
      icon={icon}
      aria-label={title}
      onClick={onClick}
    />
  </Tooltip>
);

export default SimpleActionButton;
