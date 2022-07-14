import { authorizedPageSSP } from "@components/auth/auth-redirect";
import NotificationsComponent from "@components/pages/admin/notifications";
import { Role } from "@interfaces/custom";
import React from "react";

const NotificationsPage = () => <NotificationsComponent />;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  return redirect || { props: {} };
};

export default NotificationsPage;
