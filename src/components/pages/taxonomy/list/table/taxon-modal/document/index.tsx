import { Box, Skeleton, Text } from "@chakra-ui/react";
import React from "react";

import useDocumentCount from "./use-document-count";

export function DocumentsLink({ showTaxon }) {
  const { countsData } = useDocumentCount(showTaxon);
  //const { t } = useTranslation();

  return (
    <div>
      <Skeleton isLoaded={!countsData.isLoading} borderRadius="md">
        <Box p={2} className="white-box" lineHeight={1} minWidth={200}>
          <Text fontSize="3xl" mb={2}>
            {countsData.value || 0}
          </Text>
          {/* <LocalLink href={`/observation/list`} params={{ taxon: showTaxon }}>
            <ExternalBlueLink>{t("taxon:modal.data_links.observations")}</ExternalBlueLink>
          </LocalLink> */}
          <Text>Documents</Text>
        </Box>
      </Skeleton>
    </div>
  );
}
