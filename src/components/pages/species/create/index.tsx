import { Alert, List } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { CreateSpeciesPageCheck } from "./create-species-page-check";
import { SpeciesTaxonSuggestions } from "./species-taxon-suggestions";
import { SpeciesCreateProvider } from "./species-taxon-suggestions/create/use-species-create";
import { SpeciesValidateForm } from "./validate-form";

export function SpeciesCreatePageComponent({ taxonRanksMeta, isSpeciesPage }) {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <PageHeading>
        {isSpeciesPage ? t("species:create.title") : t("taxon:create.title")}
      </PageHeading>
      {isSpeciesPage && (
        <Alert.Root borderRadius="lg" mb={4} alignItems="top">
          <List.Root as="ul" fontSize={"md"} pl={2}>
            <List.Item>
              {t("species:create.desc_1")}{" "}
              <ExternalBlueLink href="/roles/request">
                {t("species:contribute.request_permission")}
              </ExternalBlueLink>
            </List.Item>
            <List.Item>{t("species:create.desc_2")}</List.Item>
          </List.Root>
        </Alert.Root>
      )}

      <SpeciesCreateProvider taxonRanksMeta={taxonRanksMeta} isSpeciesPage={isSpeciesPage}>
        <SpeciesValidateForm />
        <CreateSpeciesPageCheck />
        <SpeciesTaxonSuggestions />
      </SpeciesCreateProvider>
    </div>
  );
}
