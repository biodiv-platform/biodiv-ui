import { authorizedPageSSR } from "@components/auth/auth-redirect";
import RolesRequestComponent from "@components/pages/roles/request";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import React from "react";

export default function RolesRequestPage({ isAdmin }) {
  return <RolesRequestComponent isAdmin={isAdmin} />;
}

export async function getServerSideProps(ctx) {
  authorizedPageSSR([Role.Any], ctx, true);

  return {
    props: {
      isAdmin: hasAccess([Role.Admin], ctx)
    }
  };
}

hasAccess([Role.Admin]);
