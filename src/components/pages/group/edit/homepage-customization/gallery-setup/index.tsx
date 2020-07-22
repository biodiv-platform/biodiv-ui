import { Box } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "@configs/i18n/useTranslation";
import React, { useState } from "react";

import GallerySetupFrom from "./gallery-setup-form";
import GallerySetupTable from "./gallery-setup-table";

export default function GallerySetup({ userGroupId, galleryList, setGalleryList }) {
  const [isCreate, setIsCreate] = useState(false);
  const { t } = useTranslation();

  return (
    <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
      <BoxHeading>{t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY_SETUP.TITLE")}</BoxHeading>
      {isCreate ? (
        <GallerySetupFrom
          isCreate={setIsCreate}
          galleryList={galleryList}
          setGalleryList={setGalleryList}
        />
      ) : (
        <GallerySetupTable
          userGroupId={userGroupId}
          setIsCreate={setIsCreate}
          setGalleryList={setGalleryList}
          galleryList={galleryList}
        />
      )}
    </Box>
  );
}
