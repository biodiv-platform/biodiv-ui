import { Box, Text } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import LocalLink from "@components/@core/local-link";
import { axGetSpeciesIdFromTaxonId } from "@services/species.service";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

export function SpeciesPageLink({ showTaxon }) {
  const { t } = useTranslation();
  const [speciesId, setSpeciesId] = useState(null);
  const getSpeciesId = async (taxonId) => {
    const { success, data } = await axGetSpeciesIdFromTaxonId(taxonId);
    if (success) {
      setSpeciesId(data);
    }
  };

  useEffect(() => {
    getSpeciesId(showTaxon);
  }, []);

  return (
    <div>
      <Box p={2} className="white-box" lineHeight={1} minWidth={200}>
        <Text fontSize="3xl" mb={2}>
          {speciesId ? 1 : 0}
        </Text>
        {speciesId ? (
          <LocalLink href={`/species/show/${speciesId}`}>
            <ExternalBlueLink>{t("taxon:modal.data_links.species")}</ExternalBlueLink>
          </LocalLink>
        ) : (
          <Text>{t("taxon:modal.data_links.species")}</Text>
        )}
      </Box>
    </div>
  );
}
