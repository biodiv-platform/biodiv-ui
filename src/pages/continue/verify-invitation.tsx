import { authorizedPageSSR } from "@components/auth/auth-redirect";
import VerifyInvitationComponent from "@components/pages/continue/verify-invitation";
import { Role } from "@interfaces/custom";
import React from "react";

const VerifyInvitation = ({ token }) => <VerifyInvitationComponent token={token} />;

VerifyInvitation.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx, true);
  return { token: ctx.query.token };
};

VerifyInvitation.config = {
  header: false,
  footer: false
};

export default VerifyInvitation;
