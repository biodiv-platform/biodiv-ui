import { Box } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import { PageHeading } from "@/components/@core/layout";

import AnnouncemntSetupFrom from "./announcement-setup-form";
import AnnouncementEditForm from "./announcement-setup-form/editform";
import AnnouncementSetupTable from "./announcement-setup-table";

function AnnouncementAdmin({ languages, announcements }) {
  const { t } = useTranslation();
  const [announcementList, setAnnouncementList] = useState(announcements);
  const [editAnnouncementData, setEditAnnouncementData] = useState(announcementList);
  const [editIndex, setEditIndex] = useState(0);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className="container mt">
      <PageHeading>🔔 {t("admin:links.announcements_configure")}</PageHeading>
      <Box p={6} rounded="lg" border="1px solid" borderColor="gray.200" boxShadow="sm" mb={4}>
        {isEdit ? (
          <AnnouncementEditForm
            setIsEdit={setIsEdit}
            announcementList={announcementList}
            setAnnouncementList={setAnnouncementList}
            editAnnouncementData={editAnnouncementData}
            languages={languages}
            index={editIndex}
          />
        ) : isCreate ? (
          <AnnouncemntSetupFrom
            setIsCreate={setIsCreate}
            announcementList={announcementList}
            setAnnouncementList={setAnnouncementList}
            languages={languages}
          />
        ) : (
          <AnnouncementSetupTable
            announcementList={announcementList}
            setAnnouncementList={setAnnouncementList}
            setEditAnnouncementData={setEditAnnouncementData}
            setIsCreate={setIsCreate}
            setIsEdit={setIsEdit}
            setEditIndex={setEditIndex}
          />
        )}
      </Box>
    </div>
  );
}

export default AnnouncementAdmin;
