import { authorizedPageSSP } from "@components/auth/auth-redirect";
import MapCreatePageComponent from "@components/pages/map/create";
import { Role } from "@interfaces/custom";
import React from "react";

export default function MapPage() {
  return <MapCreatePageComponent />;
}

MapPage.config = {
  footer: false
};

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  return redirect || { props: {} };
};
