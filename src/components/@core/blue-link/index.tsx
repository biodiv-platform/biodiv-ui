import { Link, LinkProps } from "@chakra-ui/core";
import React, { forwardRef } from "react";

const BlueLink = forwardRef(({ color = "blue.500", ...rest }: LinkProps, ref: any) => (
  <Link color={color} ref={ref} {...rest} />
));

export default BlueLink;
