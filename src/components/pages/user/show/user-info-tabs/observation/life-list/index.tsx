import { Box, SimpleGrid } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import { stringify } from "@utils/query-string";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import LifeListTable from "./table";
import useLifeList from "./use-life-list";

export default function LifeList({ userId, filter }) {
  const { t } = useTranslation();
  const ll = useLifeList(userId, filter);

  return (
    <Box className="white-box" mb={4}>
      <BoxHeading>📃 {t("user:observations.life_list")}</BoxHeading>
      <Box p={4}>
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
          <LifeListTable
            {...ll.uploaded}
            title={t("user:uploaded")}
            extraParams={(o) => stringify({ maxVotedReco: o.maxVotedRecoId, user: userId })}
          />
          <LifeListTable
            {...ll.identified}
            title={t("user:identified")}
            extraParams={(o) =>
              stringify({ recoId: o.maxVotedRecoId, authorVoted: userId, identified: true })
            }
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
}
