import SpeciesListPageComponent from "@components/pages/species/list";
import {
  SPECIES_PAGE_SIZE,
  SpeciesListProvider
} from "@components/pages/species/list/use-species-list";
import { axGetAllTraitsMeta, axGetSpeciesList } from "@services/species.service";
import { axGetSpeciesGroupList } from "@services/taxonomy.service";
import { axGroupList } from "@services/usergroup.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";

export const DEFAULT_SPECIES_FILTER = {
  sort: "species.dateCreated",
  offset: 0,
  max: 10
};

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
  const nextOffset = (Number(ctx.query.offset) || SPECIES_PAGE_SIZE) + SPECIES_PAGE_SIZE;
  const aURL = absoluteUrl(ctx).href;
  const { currentGroup } = await axGroupList(aURL);
  const initialFilterParams = {
    ...DEFAULT_SPECIES_FILTER,
    ...ctx.query,
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
      nextOffset,
      initialFilterParams
    }
  };
};

export default SpeciesListPage;
