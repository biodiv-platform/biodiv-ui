import { Icon } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import React from "react";

const Badge = ({ isAdmin }) =>
  isAdmin ? (
    <Tooltip
      hasArrow={true}
      placement="right"
      shouldWrapChildren={true}
      title="Administrator"
    >
      <Icon ml={1} name="ibpverified" />
    </Tooltip>
  ) : null;

export default Badge;
