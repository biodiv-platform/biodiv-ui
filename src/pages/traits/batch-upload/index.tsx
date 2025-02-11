import { authorizedPageSSP } from "@components/auth/auth-redirect";
import TraitsBatchUploadComponent from "@components/pages/traits/batch-upload";
import { Role } from "@interfaces/custom";
import { axGetAllTraitsMeta } from "@services/species.service";
import React from "react";

const TraitsBatchUpload = ({traits}) => <TraitsBatchUploadComponent traits={traits}/>;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  const { data: traits } = await axGetAllTraitsMeta();
  return redirect || { props: {traits} };
};

export default TraitsBatchUpload;
