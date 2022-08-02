import { authorizedPageSSP } from "@components/auth/auth-redirect";
import HomeComponent from "@components/pages/admin/homegallery";
import { Role } from "@interfaces/custom";
import React from "react";

import * as hp from "../../index";

const HomePage = ({ homeInfo }) => <HomeComponent homeInfo={homeInfo} />;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  if (redirect) return redirect;
  return hp.getServerSideProps(ctx);
};

export default HomePage;
