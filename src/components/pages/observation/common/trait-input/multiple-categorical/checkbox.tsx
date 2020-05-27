import { VisuallyHidden } from "@chakra-ui/core";
import React from "react";

import Content from "../content";

const VH: any = VisuallyHidden;

const Radio = ({ value, label, icon, ...props }) => (
  <label role="checkbox" className="custom-checkbox" aria-checked={props.isChecked}>
    <VH as="input" type="checkbox" {...props} value={value} />
    <Content value={value} label={label} icon={icon} />
  </label>
);

export default Radio;
