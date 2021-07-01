import { Alert, ListItem, UnorderedList } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { SpeciesTaxonSuggestions } from "./species-taxon-suggestions";
import { SpeciesCreateProvider } from "./species-taxon-suggestions/create/use-species-create";
import { SpeciesValidateForm } from "./validate-form";

export function SpeciesCreatePageComponent({ taxonRanksMeta }) {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <PageHeading>{t("species:create.title")}</PageHeading>
      <Alert status="info" borderRadius="md" mb={4} alignItems="top">
        <UnorderedList>
          <ListItem>
            {t("species:create.desc_1")}{" "}
            <ExternalBlueLink href="/roles/request">
              {t("species:contribute.request_permission")}
            </ExternalBlueLink>
          </ListItem>
          <ListItem>{t("species:create.desc_2")}</ListItem>
        </UnorderedList>
      </Alert>

      <SpeciesCreateProvider taxonRanksMeta={taxonRanksMeta}>
        <SpeciesValidateForm />
        <SpeciesTaxonSuggestions />
      </SpeciesCreateProvider>
    </div>
  );
}
