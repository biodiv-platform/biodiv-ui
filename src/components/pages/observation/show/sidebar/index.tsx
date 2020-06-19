import { Box } from "@chakra-ui/core";
import { Observation, UserIbp } from "@interfaces/observation";
import React from "react";

import ClusterMap from "./cluster-map";
import User from "./user";

interface ISidebarProps {
  observation: Observation;
  authorInfo: UserIbp;
  speciesId?: number;
}

export default function Sidebar({ observation, authorInfo, speciesId }: ISidebarProps) {
  return (
    <Box>
      <User user={authorInfo} />
      <ClusterMap
        speciesId={speciesId}
        latitude={observation.latitude}
        longitude={observation.longitude}
      />
    </Box>
  );
}
