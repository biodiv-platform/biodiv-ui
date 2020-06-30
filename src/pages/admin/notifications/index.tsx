import { authorizedPageSSR } from "@components/auth/auth-redirect";
import NotificationsComponent from "@components/pages/admin/notifications";
import { Role } from "@interfaces/custom";
import React from "react";

const NotificationsPage = () => <NotificationsComponent />;

NotificationsPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Admin], ctx, false);
};

export default NotificationsPage;
