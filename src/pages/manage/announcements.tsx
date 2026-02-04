import { authorizedPageSSP } from "@components/auth/auth-redirect";
import { Role } from "@interfaces/custom";
import React from "react";

import AnnouncementAdmin from "@/components/pages/manage/announcements";
import { axGetAnnouncementList, axGetLangList } from "@/services/utility.service";

export default function AnnouncementsAdminPage({ languagesList, announcementList }) {
  return <AnnouncementAdmin languages={languagesList} announcements={announcementList} />;
}

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  if (redirect) return redirect;

  const { data: languagesList } = await axGetLangList();
  const { data: announcementList } = await axGetAnnouncementList(ctx);

  return {
    props: {
      languagesList,
      announcementList
    }
  };
};
