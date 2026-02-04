import { authorizedPageSSP } from "@components/auth/auth-redirect";
import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { axGetAdminHomeInfo, axGetLangList } from "@services/utility.service";
import React from "react";

import HomeComponent from "@/components/pages/manage/homegallery";
import { getLanguageId } from "@/utils/i18n";

const HomePage = ({ homeInfo, languagesList }) => (
  <HomeComponent homeInfo={homeInfo} languages={languagesList} />
);

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  if (redirect) return redirect;

  const { data: homeInfo } = await axGetAdminHomeInfo(
    ctx,
    getLanguageId(ctx.locale)?.ID ?? SITE_CONFIG.LANG.DEFAULT_ID
  );
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
