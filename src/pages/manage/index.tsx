import { authorizedPageSSP } from "@components/auth/auth-redirect";
import { Role } from "@interfaces/custom";
import React from "react";

import AdminComponent from "@/components/pages/manage";

const AdminPage = () => <AdminComponent />;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  return redirect || { props: {} };
};

export default AdminPage;
