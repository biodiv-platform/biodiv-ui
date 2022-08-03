import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import GallerySetupFrom from "./gallery-setup-form";
import GalleryEditForm from "./gallery-setup-form/editform";
import GallerySetupTable from "./gallery-setup-tabel";

export default function GallerySetup({
  userGroupId,
  isCreate,
  setIsCreate,
  galleryList,
  setGalleryList,
  isEdit,
  setIsEdit
}) {
  const { t } = useTranslation();
  const [editGalleryData, setEditGalleryData] = useState(galleryList);

  return (
    <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
      <BoxHeading>{t("group:homepage_customization.gallery_setup.title")}</BoxHeading>
      {isEdit ? (
        <GalleryEditForm
          setIsEdit={setIsEdit}
          setGalleryList={setGalleryList}
          editGalleryData={editGalleryData}
        />
      ) : isCreate ? (
        <GallerySetupFrom
          setIsCreate={setIsCreate}
          galleryList={galleryList}
          setGalleryList={setGalleryList}
        />
      ) : (
        <GallerySetupTable
          userGroupId={userGroupId}
          setIsCreate={setIsCreate}
          setGalleryList={setGalleryList}
          galleryList={galleryList}
          setIsEdit={setIsEdit}
          setEditGalleryData={setEditGalleryData}
        />
      )}
    </Box>
  );
}
