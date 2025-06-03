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
  const [editGalleryData, setEditGalleryData] = useState(galleryList);

  return isEdit ? (
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
  );
}
