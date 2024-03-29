import { authorizedPageSSP, throwUnauthorized } from "@components/auth/auth-redirect";
import { CurateEditProvider } from "@components/pages/text-curation/edit/use-curate-edit";
import { Role } from "@interfaces/custom";
import { axShowDataset } from "@services/curate.service";
import { getParsedUser, hasAccess } from "@utils/auth";
import dynamic from "next/dynamic";
import React from "react";

const CurateEditPageComponent = dynamic(() => import("@components/pages/text-curation/edit"), {
  ssr: false
});

export default function CurateEditPage({
  data,
  datasetId,
  canEdit,
  userName,
  canValidate,
  isAdmin
}) {
  return (
    <CurateEditProvider
      initialData={data}
      datasetId={datasetId}
      canEdit={canEdit}
      isShow={false}
      userName={userName}
      canValidate={canValidate}
      isAdmin={isAdmin}
    >
      <CurateEditPageComponent />
    </CurateEditProvider>
  );
}

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  if (redirect) return redirect;

  const { data } = await axShowDataset(ctx.query.datasetId);

  const user = getParsedUser(ctx);
  const userName = user.name;
  const canEdit =
    data.contributors.includes(user.id.toString()) ||
    hasAccess([Role.Admin], ctx) ||
    data.validators.includes(user.id.toString());

  const canValidate = data.validators.includes(user.id.toString());

  const isAdmin = hasAccess([Role.Admin], ctx);

  if (!canEdit) throwUnauthorized(ctx);

  return {
    props: {
      data,
      datasetId: ctx.query.datasetId,
      canEdit,
      userName,
      canValidate,
      isAdmin
    }
  };
};
