import { Button, ButtonGroup } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axRemoveCustomField, axReorderCustomField } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import arrayMove from "array-move";
import React, { useEffect, useState } from "react";

import GalleryListItems from "./gallery-list";

const GallerySetupTable = ({ userGroupId, galleryList, setGalleryList, setIsCreate }) => {
  const [canReorder, setCanReorder] = useState<boolean>();
  const { t } = useTranslation();

  useEffect(() => {
    setGalleryList(galleryList.sort((a, b) => a.displayOrder - b.displayOrder));
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setGalleryList(arrayMove(galleryList, oldIndex, newIndex));
    setCanReorder(true);
  };

  const handleReorderCustomField = async () => {
    const payload = galleryList.map((field, displayOrder) => ({
      cfId: field.galleryList.id,
      displayOrder
    }));

    const { success } = await axReorderCustomField(userGroupId, payload);
    if (success) {
      notification(t("GROUP.HOMEPAGE_CUSTOMIZATION.REORDER.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.HOMEPAGE_CUSTOMIZATION.REORDER.FAILURE"));
    }
    setCanReorder(false);
  };

  const removeGalleryItem = async (index) => {
    const { success } = await axRemoveCustomField(userGroupId, index);
    if (success) {
      setGalleryList(galleryList.filter(({ galleryList: { id } }) => id !== index));
      notification(t("GROUP.HOMEPAGE_CUSTOMIZATION.REMOVE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.HOMEPAGE_CUSTOMIZATION.REMOVE.FAILURE"), NotificationType.Error);
    }
  };

  return (
    <>
      <table style={{ minWidth: "750px" }} className="table table-bordered">
        <thead>
          <tr>
            <th>{t("GROUP.HOMEPAGE_CUSTOMIZATION.TABLE.TITLE")}</th>
            <th>{t("GROUP.HOMEPAGE_CUSTOMIZATION.TABLE.DESCRIPTION")}</th>
            <th>{t("GROUP.HOMEPAGE_CUSTOMIZATION.TABLE.MORE_LINK")}</th>
            <th>{t("GROUP.HOMEPAGE_CUSTOMIZATION.TABLE.REMOVE_IMAGE")}</th>
          </tr>
        </thead>
        <GalleryListItems
          removeGalleryItem={removeGalleryItem}
          helperClass="sorting-row"
          galleryList={galleryList}
          onSortEnd={onSortEnd}
        />
      </table>
      <ButtonGroup spacing={4} mt={4}>
        <Button variantColor="blue" onClick={() => setIsCreate(true)} leftIcon="add">
          {t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY_SETUP.CREATE")}
        </Button>
        <Button
          variantColor="blue"
          leftIcon="check"
          float="right"
          hidden={!canReorder}
          onClick={handleReorderCustomField}
        >
          {t("GROUP.HOMEPAGE_CUSTOMIZATION.GALLERY_SETUP.SAVE_ORDER")}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GallerySetupTable;
