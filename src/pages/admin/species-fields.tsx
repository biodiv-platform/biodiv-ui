import SpeciesFieldsAdmin from "@components/pages/admin/species-fields";
import { Role } from "@interfaces/custom";
import { axGetLanguagesWithSpeciesFields } from "@services/utility.service";
import { withAuth } from "@utils/auth";
import React from "react";

export default function SpeciesFieldsAdminPage({fieldLanguages}) {
  return <SpeciesFieldsAdmin fieldLanguages={fieldLanguages} />;
}

export const getServerSideProps = async (ctx) => {
  //   const redirect = authorizedPageSSP([Role.Admin], ctx);
  //   if (redirect) return redirect;
  const { success, data } = await axGetLanguagesWithSpeciesFields();

  return {
    props: {
      fieldLanguages: data || []
    }
  };
};
