import { Box } from "@chakra-ui/react";
import { Observation, UserIbp } from "@interfaces/observation";
import React from "react";

import ClusterMap from "./cluster-map";
import User from "./user";

interface ISidebarProps {
  observation?: Observation;
  authorInfo?: UserIbp;
  taxon?: number;
}

export default function Sidebar({ observation, authorInfo, taxon }: ISidebarProps) {
  return (
    <Box mb={2}>
      <User user={authorInfo} />
      <ClusterMap
        filter={taxon && { taxon }}
        latitude={observation?.latitude}
        longitude={observation?.longitude}
      />
    </Box>
  );
}
