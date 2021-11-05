import { Link, LinkProps } from "@chakra-ui/react";
import React, { forwardRef } from "react";

const BlueLink = forwardRef((props: LinkProps, ref: any) => (
  <Link ref={ref} {...props} color="blue.500" />
));

export default BlueLink;
