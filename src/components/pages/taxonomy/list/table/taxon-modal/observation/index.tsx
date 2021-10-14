import { Box, Skeleton, Text } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useObsCount from "./use-observation-count";

export function ObservationsLink({ showTaxon }) {
  const { countsData } = useObsCount(showTaxon);
  const { t } = useTranslation();

  return (
    <Skeleton p={2} isLoaded={!countsData.isLoading} borderRadius="lg" lineHeight={1}>
      <Box p={2} className="white-box" lineHeight={1} minWidth={200}>
        <Text fontSize="3xl" mb={2}>
          {countsData.value}
        </Text>
        <LocalLink href={`/observation/list`} params={{ taxon: showTaxon }}>
          <ExternalBlueLink>{t("taxon:modal.data_links.observations")}</ExternalBlueLink>
        </LocalLink>
      </Box>
    </Skeleton>
  );
}
