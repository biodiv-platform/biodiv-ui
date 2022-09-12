import { authorizedPageSSP } from "@components/auth/auth-redirect";
import HomeComponent from "@components/pages/admin/homegallery";
import { Role } from "@interfaces/custom";
import { axGetAdminHomeInfo } from "@services/utility.service";
import React from "react";

const HomePage = ({ homeInfo }) => <HomeComponent homeInfo={homeInfo} />;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  if (redirect) return redirect;

  const { data: homeInfo } = await axGetAdminHomeInfo(ctx);

  return {
    props: {
      homeInfo: {
        ...homeInfo
      }
    }
  };
};

export default HomePage;
