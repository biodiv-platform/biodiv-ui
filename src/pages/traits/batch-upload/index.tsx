import { authorizedPageSSP } from "@components/auth/auth-redirect";
import TraitsBatchUploadComponent from "@components/pages/traits/batch-upload";
import { Role } from "@interfaces/custom";
import React from "react";

const TraitsBatchUpload = () => <TraitsBatchUploadComponent />;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  return redirect || { props: {} };
};

export default TraitsBatchUpload;
