import Tooltip from "@components/@core/tooltip";
import VerifiedIcon from "@icons/verified";
import React from "react";

const Badge = ({ isAdmin }) =>
  isAdmin ? (
    <Tooltip hasArrow={true} placement="right" shouldWrapChildren={true} title="Administrator">
      <VerifiedIcon ml={1} />
    </Tooltip>
  ) : null;

export default Badge;
