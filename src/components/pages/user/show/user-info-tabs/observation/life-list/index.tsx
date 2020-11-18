import { Box, SimpleGrid } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@hooks/use-translation";
import { stringify } from "querystring";
import React from "react";

import LifeListTable from "./table";
import useLifeList from "./use-life-list";

export default function LifeList({ userId, filter }) {
  const { t } = useTranslation();
  const ll = useLifeList(userId, filter);

  return (
    <Box className="white-box">
      <BoxHeading>📃 {t("USER.OBSERVATIONS.LIFE_LIST")}</BoxHeading>
      <Box p={4}>
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <LifeListTable
            {...ll.uploaded}
            title={t("USER.UPLOADED")}
            extraParams={(o) => stringify({ maxVotedReco: o.maxVotedRecoId, user: userId })}
          />
          <LifeListTable
            {...ll.identified}
            title={t("USER.IDENTIFIED")}
            extraParams={(o) =>
              stringify({ recoId: o.maxVotedRecoId, authorVoted: userId, identified: true })
            }
          />
        </SimpleGrid>
      </Box>
    </Box>
  );
}
