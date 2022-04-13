import { throwUnauthorized } from "@components/auth/auth-redirect";
import CurateEditPageComponent from "@components/pages/text-curation/edit";
import { CurateEditProvider } from "@components/pages/text-curation/edit/use-curate-edit";
import { Role } from "@interfaces/custom";
import { axShowDataset } from "@services/curate.service";
import { getParsedUser, hasAccess } from "@utils/auth";
import React from "react";

export default function CurateEditPage({ data, datasetId, canEdit }) {
  return (
    <CurateEditProvider initialData={data} datasetId={datasetId} canEdit={canEdit} isShow={false}>
      <CurateEditPageComponent />
    </CurateEditProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  const { data } = await axShowDataset(ctx.query.datasetId);

  const user = getParsedUser(ctx);
  const canEdit = data.contributors.includes(user.id.toString()) || hasAccess([Role.Admin]);

  if (!canEdit) throwUnauthorized(ctx);

  return {
    props: {
      data,
      datasetId: ctx.query.datasetId,
      canEdit
    }
  };
};
