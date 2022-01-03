import SpeciesListPageComponent from "@components/pages/species/list";
import { SpeciesListProvider } from "@components/pages/species/list/use-species-list";
import { axGetAllTraitsMeta, axGetSpeciesList } from "@services/species.service";
import { axGetSpeciesGroupList } from "@services/taxonomy.service";
import { axGroupList } from "@services/usergroup.service";
import { DEFAULT_SPECIES_FILTER } from "@static/species";
import { absoluteUrl } from "@utils/basic";
import React from "react";

function SpeciesListPage({ speciesData, species, traits, initialFilterParams }) {
  return (
    <SpeciesListProvider
      speciesData={speciesData}
      traits={traits}
      species={species}
      filter={initialFilterParams}
    >
      <SpeciesListPageComponent />;
    </SpeciesListProvider>
  );
}

SpeciesListPage.config = {
  footer: false
};

export const getServerSideProps = async (ctx) => {
  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(aURL);
  const initialFilterParams = {
    ...ctx.query,
    ...DEFAULT_SPECIES_FILTER,
    userGroupList: currentGroup?.id
  };
  const { data } = await axGetSpeciesList(initialFilterParams);

  const { data: species } = await axGetSpeciesGroupList();

  const { data: traits } = await axGetAllTraitsMeta();
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
      initialFilterParams
    }
  };
};

export default SpeciesListPage;
