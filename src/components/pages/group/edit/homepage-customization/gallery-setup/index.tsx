import { Box } from "@chakra-ui/react";
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
  setIsEdit,
  languages
}) {
  const [editGalleryData, setEditGalleryData] = useState(galleryList);

  return isEdit ? (
    <Box p={3}>
      <GalleryEditForm
        setIsEdit={setIsEdit}
        setGalleryList={setGalleryList}
        editGalleryData={editGalleryData}
        languages={languages}
      />
    </Box>
  ) : isCreate ? (
    <Box p={3}>
      <GallerySetupFrom
        setIsCreate={setIsCreate}
        galleryList={galleryList}
        setGalleryList={setGalleryList}
        languages={languages}
        groupId={userGroupId}
      />
    </Box>
  ) : (
    <Box p={3}>
      <GallerySetupTable
        userGroupId={userGroupId}
        setIsCreate={setIsCreate}
        setGalleryList={setGalleryList}
        galleryList={galleryList}
        setIsEdit={setIsEdit}
        setEditGalleryData={setEditGalleryData}
      />
    </Box>
  );
}
