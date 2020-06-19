import { authorizedPageSSR } from "@components/auth/auth-redirect";
import VerifyRequestComponent from "@components/pages/continue/verify-request";
import { Role } from "@interfaces/custom";
import React from "react";

const VerifyRequestPage = ({ token }) => <VerifyRequestComponent token={token} />;

VerifyRequestPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx, true);
  return { token: ctx.query.token };
};

VerifyRequestPage.config = {
  header: false,
  footer: false
};

export default VerifyRequestPage;
