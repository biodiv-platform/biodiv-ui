import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
//reusing  GallerySetupFrom component from group page
import GallerySetupFrom from "@components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import GalleryEditForm from "./gallery-setup-form/editform";
import GallerySetupTable from "./gallery-setup-tabel";

export default function GallerySetup({
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
      <BoxHeading>{t("group:homepage_customization.title")}</BoxHeading>
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
