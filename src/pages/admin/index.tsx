import { authorizedPageSSP } from "@components/auth/auth-redirect";
import AdminComponent from "@components/pages/admin";
import { Role } from "@interfaces/custom";
import React from "react";

const AdminPage = () => <AdminComponent />;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  return redirect || { props: {} };
};

export default AdminPage;
