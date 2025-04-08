import { authorizedPageSSP } from "@components/auth/auth-redirect";
import TraitsBatchUploadComponent from "@components/pages/traits/batch-upload";
import { Role } from "@interfaces/custom";
import { axGetTraitNames } from "@services/traits.service";
import { axGetLangList } from "@services/utility.service";
import React from "react";

const TraitsBatchUpload = ({ traits, languagesList }) => (
  <TraitsBatchUploadComponent traits={traits} languages={languagesList} />
);

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  const { data: traits } = await axGetTraitNames();
  const languagesList = await axGetLangList();
  return redirect || { props: { traits, languagesList: languagesList.data } };
};

export default TraitsBatchUpload;
