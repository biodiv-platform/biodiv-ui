import { IconButton } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";

interface SimpleActionButtonProps {
  icon;
  title;
  onClick?;
  colorPalette?;
  disabled?;
}

const SimpleActionButton = ({
  icon,
  title,
  onClick,
  colorPalette,
  disabled
}: SimpleActionButtonProps) => (
  <Tooltip title={title} positioning={{ placement: "bottom" }}>
    <IconButton
      size="lg"
      rounded={"full"}
      variant="ghost"
      colorPalette={colorPalette || "blue"}
      aria-label={title}
      onClick={onClick}
      disabled={disabled ? true : false}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

export default SimpleActionButton;
