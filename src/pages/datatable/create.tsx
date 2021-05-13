import { authorizedPageSSR } from "@components/auth/auth-redirect";
import DataTableCreatePageComponent from "@components/pages/datatable/create";
import { Role } from "@interfaces/custom";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetLangList } from "@services/utility.service";
import React from "react";

const DataTableCreatePage = ({ speciesGroups, languages, datasetId }) => (
  <DataTableCreatePageComponent
    speciesGroups={speciesGroups}
    languages={languages}
    datasetId={datasetId}
  />
);

export async function getServerSideProps(ctx) {
  authorizedPageSSR([Role.Any], ctx, true);

  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data } = await axGetLangList();

  return {
    props: {
      speciesGroups,
      languages: data.map((l) => ({ label: l.name, value: l.id })),
      datasetId: ctx.query.dataset || null
    }
  };
}

export default DataTableCreatePage;
