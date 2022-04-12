import { CurateEditProvider } from "@components/pages/text-curation/edit/use-curate-edit";
import CurateShowPageComponent from "@components/pages/text-curation/show";
import { axShowDataset } from "@services/curate.service";
import React from "react";

export default function CurateEditPage({ data }) {
  return (
    <CurateEditProvider initialData={data} isShow={true}>
      <CurateShowPageComponent />
    </CurateEditProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  const { data } = await axShowDataset(ctx.query.datasetId);
  return { props: { data } };
};
