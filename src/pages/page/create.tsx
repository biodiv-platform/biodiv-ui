import { authorizedPageSSP } from "@components/auth/auth-redirect";
import PageCreatePageComponent from "@components/pages/page/create";
import { Role } from "@interfaces/custom";
import React from "react";

export default function PageCreatePage() {
  return <PageCreatePageComponent />;
}

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  return redirect || { props: {} };
};
