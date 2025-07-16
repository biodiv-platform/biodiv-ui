import { SimpleGrid } from "@chakra-ui/react";
import { HomePageStats } from "@interfaces/utility";
import { CARD_META } from "@static/home";
import React from "react";

import Card from "./card";

interface IStatsProps {
  portalStats?: HomePageStats;
}

export default function Stats({ portalStats }: IStatsProps) {
  return portalStats ? (
    <SimpleGrid columns={[2, 2, 3, 5]} gap={6} mb={10}>
      {Object.keys(CARD_META).map((name, index) => (
        <Card
          key={name}
          name={name}
          count={portalStats[name]}
          meta={CARD_META[name]}
          index={index}
        />
      ))}
    </SimpleGrid>
  ) : null;
}
