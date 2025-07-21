import { Badge as B } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import React from "react";
import { LuBadgeCheck } from "react-icons/lu";

const Badge = ({ isAdmin }) =>
  isAdmin ? (
    <Tooltip showArrow={true} positioning={{ placement: "right" }} title="Administrator">
      <B variant="plain" colorPalette="green" fontSize={"xl"}>
        <LuBadgeCheck />
      </B>
    </Tooltip>
  ) : null;

export default Badge;
