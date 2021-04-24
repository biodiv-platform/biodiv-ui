import { useLocalRouter } from "@components/@core/local-link";
import DataTableCreatePageComponent from "@components/pages/datatable/create";
import useGlobalState from "@hooks/use-global-state";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetLangList } from "@services/utility.service";
import { encode } from "base64-url";
import React, { useEffect } from "react";

const DataTableCreatePage = ({ speciesGroups, languages, datasetId }) => {
  const { isLoggedIn } = useGlobalState();
  const { push, asPath } = useLocalRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      push("/login", true, { forward: encode(asPath) });
    }
  }, []);

  return isLoggedIn ? (
    <DataTableCreatePageComponent
      speciesGroups={speciesGroups}
      languages={languages}
      datasetId={datasetId}
    />
  ) : null;
};

export async function getServerSideProps(ctx) {
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
