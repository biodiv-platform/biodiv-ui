import { Box, Image } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import { getSpeciesIcon } from "@utils/media";
import React from "react";

const CustomRadio = React.forwardRef((props: any, ref) => {
  const { isChecked, isDisabled, value, icon, ...rest } = props;
  return (
    <Box
      ref={ref}
      role="radio"
      className="species-radio"
      aria-checked={isChecked}
      borderRadius="md"
      p={1}
      {...rest}
    >
      <Tooltip title={icon} placement="top" hasArrow={true}>
        <Image size="3rem" src={getSpeciesIcon(icon)} alt={icon} />
      </Tooltip>
    </Box>
  );
});

export default CustomRadio;
