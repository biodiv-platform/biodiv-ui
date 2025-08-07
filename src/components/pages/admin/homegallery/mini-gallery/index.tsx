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
  sliderList,
  setSliderList,
  handleFormSubmit,
  groupId = -1
}) {
  const { t } = useTranslation();
  const [isGalleryCreate, setIsGalleryCreate] = useState(false);
  const [isGalleryEdit, setIsGalleryEdit] = useState(false);
  const [editGalleryData, setEditGalleryData] = useState(miniGallery);
  const [editIndex, setEditIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <Box>
      {isGalleryEdit ? (
        <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
          <EditMiniGalleryForm
            setIsEdit={setIsGalleryEdit}
            editGalleryData={editGalleryData}
            miniGalleryList={miniGallery}
            setMiniGalleryList={setMiniGallery}
            index={editIndex}
            languages={languages}
            groupId = {groupId}
          />
        </Box>
      ) : isGalleryCreate ? (
        <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
          <CreateMiniGalleryForm
            setIsCreate={setIsGalleryCreate}
            miniGalleryList={miniGallery}
            setMiniGalleryList={setMiniGallery}
            languages={languages}
            sliderList={sliderList}
            setSliderList={setSliderList}
            setOpenIndex={setOpenIndex}
            groupId = {groupId}
          />
        </Box>
      ) : (
        <>
          {groupId==-1 ? miniGallery?.map((item, index) => (
            <MiniGalleryItem
              key={index}
              item={item}
              index={index}
              languages={languages}
              onEdit={(i, data) => {
                setIsGalleryEdit(true);
                setEditGalleryData(data);
                setEditIndex(i);
              }}
              onDelete={(i) => {
                setMiniGallery(miniGallery.filter((_, idx) => idx !== i));
                setSliderList(sliderList.filter((_, idx) => idx !== i));
              }}
              sliderList={sliderList}
              setSliderList={setSliderList}
              handleFormSubmit={handleFormSubmit}
              shouldOpen={index==openIndex}
            />
          )):miniGallery?.map((item, index) => (
            <MiniGroupGalleryItem
              key={index}
              item={item}
              index={index}
              languages={languages}
              onEdit={(i, data) => {
                setIsGalleryEdit(true);
                setEditGalleryData(data);
                setEditIndex(i);
              }}
              onDelete={(i) => {
                setMiniGallery(miniGallery.filter((_, idx) => idx !== i));
                setSliderList(sliderList.filter((_, idx) => idx !== i));
              }}
              sliderList={sliderList}
              setSliderList={setSliderList}
              handleFormSubmit={handleFormSubmit}
              shouldOpen={index==openIndex}
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
