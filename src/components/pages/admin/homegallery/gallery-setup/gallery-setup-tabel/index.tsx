import { Button, ButtonGroup } from "@chakra-ui/react";
import GalleryListItems from "@components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-tabel/gallery-list";
import AddIcon from "@icons/add";
import CheckIcon from "@icons/check";
import { axRemoveHomePageGallery, axReorderHomePageGallery } from "@services/utility.service";
import notification, { NotificationType } from "@utils/notification";
import { arrayMoveImmutable } from "array-move";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

const GallerySetupTable = ({
  galleryList,
  setGalleryList,
  setIsCreate,
  setIsEdit,
  setEditGalleryData
}) => {
  const [showReorder, setCanReorder] = useState<boolean>();
  const { t } = useTranslation();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setGalleryList(arrayMoveImmutable(galleryList, oldIndex, newIndex));
    setCanReorder(true);
  };

  const handleReorderAlter = () => {
    setCanReorder(false);
    notification(t("group:homepage_customization.gallery_setup.alert"));
  };

  const handleReorderCustomField = async () => {
    const payload = galleryList.map((galleryItem, index) => ({
      galleryId: galleryItem.id,
      displayOrder: index
    }));

    const { success } = await axReorderHomePageGallery(payload);
    if (success) {
      notification(t("group:homepage_customization.reorder.success"), NotificationType.Success);
    } else {
      notification(t("group:homepage_customization.reorder.failure"));
    }
    setCanReorder(false);
  };

  const removeGalleryItem = async (index) => {
    if (galleryList[index]?.id) {
      const { success } = await axRemoveHomePageGallery(galleryList[index].id);
      if (success) {
        notification(t("group:homepage_customization.remove.success"), NotificationType.Success);
        setGalleryList(galleryList.filter((item, idx) => idx !== index));
      } else {
        notification(t("group:homepage_customization.remove.failure"), NotificationType.Error);
      }
    }
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
            <th>{t("group:homepage_customization.table.enabled")}</th>
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
      <ButtonGroup spacing={4} mt={4}>
        <Button colorScheme="blue" onClick={() => setIsCreate(true)} leftIcon={<AddIcon />}>
          {"Create Gallery Image"}
        </Button>
        <Button
          colorScheme="blue"
          leftIcon={<CheckIcon />}
          float="right"
          hidden={!showReorder}
          onClick={
            galleryList.some((e) => e.id === undefined)
              ? handleReorderAlter
              : handleReorderCustomField
          }
        >
          {t("group:homepage_customization.gallery_setup.save_order")}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GallerySetupTable;
