import { CurateEditProvider } from "@components/pages/text-curation/edit/use-curate-edit";
import CurateShowPageComponent from "@components/pages/text-curation/show";
import { Role } from "@interfaces/custom";
import { axShowDataset } from "@services/curate.service";
import { getParsedUser, hasAccess } from "@utils/auth";
import React from "react";

export default function CurateEditPage({ data, datasetId, canEdit, userName, canValidate }) {
  return (
    <CurateEditProvider
      initialData={data}
      datasetId={datasetId}
      canEdit={canEdit}
      isShow={true}
      userName={userName}
      canValidate={canValidate}
    >
      <CurateShowPageComponent />
    </CurateEditProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  const { data } = await axShowDataset(ctx.query.datasetId);

  const user = getParsedUser(ctx);
  const userName = user.name;
  const canEdit =
    data.contributors.includes(user.id.toString()) ||
    hasAccess([Role.Admin], ctx) ||
    data.validators.includes(user.id.toString());

  const canValidate = data.validators.includes(user.id.toString());

  return {
    props: {
      data,
      datasetId: ctx.query.datasetId,
      canEdit,
      userName,
      canValidate
    }
  };
};
