import SpeciesFieldsAdmin from "@components/pages/admin/species-fields";
import { Role } from "@interfaces/custom";
import { withAuth } from "@utils/auth";
import React from "react";

export default function SpeciesFieldsAdminPage() {
  return <SpeciesFieldsAdmin />;
}

export const getServerSideProps = async (ctx) => {
//   const redirect = authorizedPageSSP([Role.Admin], ctx);
//   if (redirect) return redirect;
  
  return {
    props: {}
  };
}; 