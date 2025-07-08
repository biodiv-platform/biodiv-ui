import { authorizedPageSSP } from "@components/auth/auth-redirect";
import HomeComponent from "@components/pages/admin/homegallery";
import { Role } from "@interfaces/custom";
import { axGetAdminHomeInfo, axGetLangList } from "@services/utility.service";
import React from "react";

const HomePage = ({ homeInfo, languagesList }) => <HomeComponent homeInfo={homeInfo} languages={languagesList}/>;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  if (redirect) return redirect;

  const { data: homeInfo } = await axGetAdminHomeInfo(ctx);
  const { data: languagesList } = await axGetLangList();

  return {
    props: {
      homeInfo: {
        ...homeInfo
      },
      languagesList
    }
  };
};

export default HomePage;
