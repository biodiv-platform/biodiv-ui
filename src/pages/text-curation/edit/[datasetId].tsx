import CurateEditPageComponent from "@components/pages/text-curation/edit";
import { CurateEditProvider } from "@components/pages/text-curation/edit/use-curate-edit";
import { axShowDataset } from "@services/curate.service";
import React from "react";

export default function CurateEditPage({ data }) {
  return (
    <CurateEditProvider initialData={data}>
      <CurateEditPageComponent />
    </CurateEditProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  const { data } = await axShowDataset(ctx.query.datasetId);
  return { props: { data } };
};
