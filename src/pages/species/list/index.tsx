import SpeciesListPageComponent from "@components/pages/species/list";
import { SpeciesListProvider } from "@components/pages/species/list/use-species-list";
import SITE_CONFIG from "@configs/site-config";
import { axGroupList } from "@services/app.service";
import { axGetObservationListConfig } from "@services/observation.service";
import {
  axGetAllFieldsMeta,
  axGetAllTraitsMeta,
  axGetSpeciesList
} from "@services/species.service";
import { axGetSpeciesGroupList } from "@services/taxonomy.service";
import { DEFAULT_SPECIES_FILTER } from "@static/species";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
import React from "react";

function SpeciesListPage({
  listConfig,
  speciesData,
  species,
  traits,
  fieldsMeta,
  initialFilterParams
}) {
  return (
    <SpeciesListProvider
      {...listConfig}
      speciesData={speciesData}
      traits={traits}
      species={species}
      fieldsMeta={fieldsMeta}
      filter={initialFilterParams}
    >
      <SpeciesListPageComponent />
    </SpeciesListProvider>
  );
}

SpeciesListPage.config = {
  footer: false
};

export const getServerSideProps = async (ctx) => {
  const aURL = absoluteUrl(ctx).href;
  const langId = SITE_CONFIG.SPECIES.MULTILINGUAL_FIELDS
    ? getLanguageId(ctx.locale)?.ID
    : SITE_CONFIG.LANG.DEFAULT_ID;
  const { currentGroup } = await axGroupList(aURL);
  const initialFilterParams = {
    ...ctx.query,
    ...DEFAULT_SPECIES_FILTER,
    userGroupList: currentGroup?.id
  };
  const { data } = await axGetSpeciesList(initialFilterParams);

  const { data: species } = await axGetSpeciesGroupList();

  const { data: traits } = await axGetAllTraitsMeta();

  const { data: fieldsMeta } = await axGetAllFieldsMeta({ langId, userGroupId: currentGroup.id });

  const { data: listConfig } = await axGetObservationListConfig();

  return {
    props: {
      speciesData: {
        l: data?.speciesTiles || [],
        ag: data?.aggregationData,
        n: data?.totalCount,
        hasMore: true
      },
      species,
      traits,
      fieldsMeta,
      initialFilterParams,
      listConfig
    }
  };
};

export default SpeciesListPage;
