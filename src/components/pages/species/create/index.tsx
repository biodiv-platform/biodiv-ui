import { Alert, ListItem, UnorderedList } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@hooks/use-translation";
import React from "react";

import { SpeciesTaxonSuggestions } from "./species-taxon-suggestions";
import { SpeciesCreateProvider } from "./species-taxon-suggestions/create/use-species-create";
import { SpeciesValidateForm } from "./validate-form";

export function SpeciesCreatePageComponent({ taxonRanksMeta }) {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <PageHeading>{t("SPECIES.CREATE.TITLE")}</PageHeading>
      <Alert status="info" borderRadius="md" mb={4} alignItems="top">
        <UnorderedList>
          <ListItem>
            {t("SPECIES.CREATE.DESC_1")}{" "}
            <ExternalBlueLink href="/species/taxonBrowser">
              {t("SPECIES.CONTRIBUTE.REQUEST_PERMISSION")}
            </ExternalBlueLink>
          </ListItem>
          <ListItem>{t("SPECIES.CREATE.DESC_2")}</ListItem>
        </UnorderedList>
      </Alert>

      <SpeciesCreateProvider taxonRanksMeta={taxonRanksMeta}>
        <SpeciesValidateForm />
        <SpeciesTaxonSuggestions />
      </SpeciesCreateProvider>
    </div>
  );
}
