import { VisuallyHidden, Image } from "@chakra-ui/core";
import React from "react";
import { getSpeciesIcon } from "@utils/media";
import Tooltip from "@components/@core/tooltip";
const VH: any = VisuallyHidden;

const Radio = ({ value, label, icon, ...props }) => (
  <label role="checkbox" className="custom-checkbox" aria-checked={props.isChecked}>
    <VH as="input" type="checkbox" {...props} value={value} />
    <Tooltip title={icon} placement="top" hasArrow={true}>
      <Image size="3rem" src={getSpeciesIcon(icon)} alt={icon} />
    </Tooltip>
  </label>
);

export default Radio;
