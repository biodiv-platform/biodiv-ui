import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import MiniGroupGalleryItem from "@/components/pages/group/edit/homepage-customization/mini-group-gallery/mini-group-gallery-item";
import AddIcon from "@/icons/add";

import CreateMiniGalleryForm from "./create";
import EditMiniGalleryForm from "./edit";
import MiniGalleryItem from "./mini-gallery-item";

export default function MiniGallery({
  miniGallery,
  setMiniGallery,
  languages,
  handleFormSubmit,
  groupId = -1,
  mode = "edit"
}) {
  const { t } = useTranslation();
  const [isGalleryCreate, setIsGalleryCreate] = useState(false);
  const [isGalleryEdit, setIsGalleryEdit] = useState(false);
  const [editGalleryData, setEditGalleryData] = useState(miniGallery);
  const [editIndex, setEditIndex] = useState(0);
  const [, setOpenIndex] = useState(null);
  return (
    <Box>
      {mode == "edit" && isGalleryEdit ? (
        <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
          <EditMiniGalleryForm
            setIsEdit={setIsGalleryEdit}
            editGalleryData={editGalleryData}
            miniGalleryList={miniGallery}
            setMiniGalleryList={setMiniGallery}
            index={editIndex}
            languages={languages}
            groupId={groupId}
            item={miniGallery[editIndex]}
            setMiniGallery={setMiniGallery}
            miniGallery={miniGallery}
            handleItemFormSubmit={handleFormSubmit}
          />
        </Box>
      ) : isGalleryCreate ? (
        <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
          <CreateMiniGalleryForm
            setIsCreate={setIsGalleryCreate}
            miniGalleryList={miniGallery}
            setMiniGalleryList={setMiniGallery}
            languages={languages}
            setOpenIndex={setOpenIndex}
            groupId={groupId}
            mode={mode}
          />
        </Box>
      ) : (
        <>
          {mode == "edit" && groupId == -1
            ? miniGallery?.map((item, index) => (
                <MiniGalleryItem
                  key={index}
                  item={item}
                  index={index}
                  onEdit={(i, data) => {
                    setIsGalleryEdit(true);
                    setEditGalleryData(data);
                    setEditIndex(i);
                  }}
                  onDelete={(i) => {
                    setMiniGallery(miniGallery.filter((_, idx) => idx !== i));
                  }}
                />
              ))
            : miniGallery?.map((item, index) => (
                <MiniGroupGalleryItem
                  key={index}
                  item={item}
                  index={index}
                  onEdit={(i, data) => {
                    setIsGalleryEdit(true);
                    setEditGalleryData(data);
                    setEditIndex(i);
                  }}
                  onDelete={(i) => {
                    setMiniGallery(miniGallery.filter((_, idx) => idx !== i));
                  }}
                  groupId={groupId}
                />
              ))}
          <ButtonGroup gap={4} mt={4}>
            <Button colorPalette="blue" onClick={() => setIsGalleryCreate(true)}>
              <AddIcon />
              {t("group:homepage_customization.mini_gallery_setup.create")}
            </Button>
          </ButtonGroup>
        </>
      )}
    </Box>
  );
}
