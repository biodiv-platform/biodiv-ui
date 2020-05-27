import { IconButton } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

const SimpleButton = ({ icon, title, onClick = null, variantColor = "blue" }) => {
  const { t } = useTranslation();

  const tTitle = t(`OBSERVATION.${title}`);
  return (
    <Tooltip title={tTitle} placement="bottom">
      <IconButton
        size="lg"
        isRound={true}
        variant="ghost"
        variantColor={variantColor}
        icon={icon}
        aria-label={tTitle}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default SimpleButton;
