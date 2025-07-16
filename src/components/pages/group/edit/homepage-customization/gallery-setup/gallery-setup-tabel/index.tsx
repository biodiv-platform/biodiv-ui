import { Button, ButtonGroup } from "@chakra-ui/react";
import AddIcon from "@icons/add";
import CheckIcon from "@icons/check";
import {
  axRemoveGroupHomePageGalleryImage,
  axReorderGroupHomePageGallery
} from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import { arrayMoveImmutable } from "array-move";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import GalleryListItems from "./gallery-list";

const GallerySetupTable = ({
  userGroupId,
  galleryList,
  setGalleryList,
  setIsCreate,
  setIsEdit,
  setEditGalleryData
}) => {
  const [showReorder, setCanReorder] = useState<boolean>();
  const { t } = useTranslation();

  useEffect(() => {
    setGalleryList(galleryList.sort((a, b) => a.displayOrder - b.displayOrder));
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setGalleryList(arrayMoveImmutable(galleryList, oldIndex, newIndex));
    setCanReorder(true);
  };

  const handleReorderAlter = () => {
    setCanReorder(false);
    notification(t("group:homepage_customization.gallery_setup.alert"));
  };

  const handleReorderCustomField = async () => {
    const payload = galleryList.map(({ id }, index) => ({
      galleryId: id,
      displayOrder: index
    }));

    const { success } = await axReorderGroupHomePageGallery(userGroupId, payload);
    if (success) {
      notification(t("group:homepage_customization.reorder.success"), NotificationType.Success);
    } else {
      notification(t("group:homepage_customization.reorder.failure"));
    }
    setCanReorder(false);
  };

  const removeGalleryItem = async (index) => {
    if (galleryList[index]?.id) {
      const { success } = await axRemoveGroupHomePageGalleryImage(userGroupId, galleryList, index);
      if (!success) {
        notification(t("group:homepage_customization.remove.failure"), NotificationType.Error);
      }
    }
    setGalleryList(galleryList.filter((item, idx) => idx !== index));
    notification(t("group:homepage_customization.remove.success"), NotificationType.Success);
  };

  const editGalleryItem = async (index) => {
    setIsEdit(true);
    setEditGalleryData(galleryList[index]);
  };

  return (
    <>
      <table style={{ minWidth: "750px" }} className="table table-bordered">
        <thead>
          <tr>
            <th>{t("group:homepage_customization.table.title")}</th>
            <th>{t("group:homepage_customization.table.image")}</th>
            <th>{t("group:homepage_customization.table.description")}</th>
            <th>{t("group:homepage_customization.table.more_link")}</th>
            <th>{t("group:homepage_customization.table.actions")}</th>
          </tr>
        </thead>
        <GalleryListItems
          editGalleryItem={editGalleryItem}
          removeGalleryItem={removeGalleryItem}
          helperClass="sorting-row"
          galleryList={galleryList}
          onSortEnd={onSortEnd}
        />
      </table>
      <ButtonGroup gap={4} mt={4}>
        <Button colorPalette="blue" onClick={() => setIsCreate(true)}>
          {t("group:homepage_customization.gallery_setup.create")}
          <AddIcon />
        </Button>
        <Button
          colorPalette="blue"
          float="right"
          hidden={!showReorder}
          onClick={
            galleryList.some((e) => e.id === undefined)
              ? handleReorderAlter
              : handleReorderCustomField
          }
        >
          {t("group:homepage_customization.gallery_setup.save_order")}
          <CheckIcon />
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GallerySetupTable;
