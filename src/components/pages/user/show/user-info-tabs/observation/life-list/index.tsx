import { Box, SimpleGrid } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@hooks/use-translation";
import { stringify } from "querystring";
import React from "react";
import LifeListFilter from "./filter";

import LifeListTable from "./table";
import useLifeList from "./use-life-list";

export default function LifeList({ userId }) {
  const { t } = useTranslation();
  const ll = useLifeList(userId);

  return (
    <Box className="white-box" p={4} mb={6}>
      <PageHeading size="md">📃 {t("USER.OBSERVATIONS.LIFE_LIST")}</PageHeading>

      <LifeListFilter
        speciesGroups={ll.speciesGroups}
        filter={ll.filter}
        setFilter={ll.setFilter}
      />

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
        <LifeListTable
          {...ll.uploaded}
          title={t("USER.UPLOADED")}
          extraParams={(o) => stringify({ recom: o.maxVotedRecoId })}
        />
        <LifeListTable
          {...ll.identified}
          title={t("USER.IDENTIFIED")}
          extraParams={(o) => stringify({ recom: o.taxonId, user: userId, identified: true })}
        />
      </SimpleGrid>
    </Box>
  );
}
