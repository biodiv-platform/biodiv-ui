import { Box } from "@chakra-ui/react";
import GallerySetupFrom from "@components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form";
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
  const [editGalleryData, setEditGalleryData] = useState(galleryList);

  return (
    <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
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
