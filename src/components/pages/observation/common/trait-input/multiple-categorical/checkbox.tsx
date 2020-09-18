import { VisuallyHidden } from "@chakra-ui/core";
import React from "react";

import Content from "../content";

const Radio = ({ value, label, icon, ...props }) => (
  <label role="checkbox" className="custom-checkbox" aria-checked={props.isChecked}>
    <VisuallyHidden type="checkbox" as="input" value={value} {...props} />
    <Content value={value} label={label} icon={icon} />
  </label>
);

export default Radio;
