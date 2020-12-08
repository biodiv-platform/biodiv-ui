import { Box } from "@chakra-ui/react";
import { Observation, UserIbp } from "@interfaces/observation";
import React from "react";

import ClusterMap from "./cluster-map";
import User from "./user";

interface ISidebarProps {
  observation?: Observation;
  authorInfo?: UserIbp;
  speciesId?: number;
}

export default function Sidebar({ observation, authorInfo, speciesId }: ISidebarProps) {
  return (
    <Box mb={2}>
      <User user={authorInfo} />
      <ClusterMap
        filter={speciesId && { speciesId }}
        latitude={observation?.latitude}
        longitude={observation?.longitude}
      />
    </Box>
  );
}
