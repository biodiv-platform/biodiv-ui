import { authorizedPageSSR } from "@components/auth/auth-redirect";
import AdminComponent from "@components/pages/admin";
import { Role } from "@interfaces/custom";
import React from "react";

const AdminPage = () => <AdminComponent />;

AdminPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Admin], ctx, false);
};

export default AdminPage;
