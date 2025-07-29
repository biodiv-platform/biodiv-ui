import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Badge,
  Box,
  Flex,
  Heading,
  IconButton
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import GallerySetupFrom from "@/components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form";
import DeleteIcon from "@/icons/delete";
import EditIcon from "@/icons/edit";
import { axRemoveMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

import GalleryEditForm from "../gallery-setup/gallery-setup-form/editform";
import GallerySetupTable from "../gallery-setup/gallery-setup-tabel";

export default function MiniGalleryItem({ item, index, languages, onEdit, onDelete, miniGallery, setMiniGallery }) {
  const { t } = useTranslation();

  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(item?.gallerySlider);
  const [galleryList, setGalleryList] = useState(item?.gallerySlider)
  /*const [galleryList, setGalleryList] = useState(
    Object.entries(item?.gallerySlider || {}).sort((a, b) => {
      const aOrder = parseInt(a[0].split("|")[1], 10);
      const bOrder = parseInt(b[0].split("|")[1], 10);
      return aOrder - bOrder;
    })
  );*/

  const handleDelete = async () => {
    const { success } = await axRemoveMiniGallery(item.id);
    if (success) {
      notification(
        t("group:homepage_customization.mini_gallery_setup.delete_success"),
        NotificationType.Success
      );
      onDelete(index);
    } else {
      notification(
        t("group:homepage_customization.mini_gallery_setup.delete_error"),
        NotificationType.Error
      );
    }
  };

  return (
    <Flex className="container fadeInUp" align="center" justify="left">
      <AccordionRoot multiple>
        <AccordionItem
          mb={8}
          bg="white"
          border="1px solid var(--chakra-colors-gray-300)"
          borderRadius="md"
          value={`value-${index}`}
        >
          <AccordionItemTrigger _expanded={{ bg: "gray.100" }} pl={4} pr={4}>
            <Flex flex={1} align="center" justify="space-between">
              <Heading as="h2" fontSize="1.2rem">
                {`${item.title} Setup`}
                <Badge colorPalette={item.isActive ? "blue" : "red"} ml={2}>
                  {item.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </Heading>
              <Box>
                <IconButton
                  colorPalette="blue"
                  className="action"
                  aria-label={t("common:edit")}
                  title={t("common:edit")}
                  variant="plain"
                  size="xl"
                  onClick={() => onEdit(index, item)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  colorPalette="red"
                  className="action"
                  aria-label={t("common:delete")}
                  title={t("common:delete")}
                  variant="plain"
                  size="xl"
                  onClick={handleDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Flex>
          </AccordionItemTrigger>
          <AccordionItemContent p={4}>
            <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
              {isEdit ? (
                <GalleryEditForm
                  setIsEdit={setIsEdit}
                  setGalleryList={(v)=>{
                    setGalleryList(v)
                    miniGallery[index].gallerySlider = v;
                    setMiniGallery(miniGallery)
                  }}
                  editGalleryData={editData}
                  languages={languages}
                  galleryId={item.id}
                  index={index}
                  vertical={item.isVertical}
                />
              ) : isCreate ? (
                <GallerySetupFrom
                  setIsCreate={setIsCreate}
                  galleryList={miniGallery[index].gallerySlider}
                  setGalleryList={(v)=>{
                    setGalleryList(v)
                    miniGallery[index].gallerySlider = v;
                    setMiniGallery(miniGallery)
                  }}
                  languages={languages}
                  group={false}
                  galleryId={item.id}
                  vertical={item.isVertical}
                />
              ) : (
                <GallerySetupTable
                  setIsCreate={setIsCreate}
                  setGalleryList={(v)=>{
                    setGalleryList(v)
                    miniGallery[index].gallerySlider = v;
                    setMiniGallery(miniGallery)
                  }}
                  galleryList={galleryList}
                  setIsEdit={setIsEdit}
                  setEditGalleryData={setEditData}
                  galleryId={item.id}
                />
              )}
            </Box>
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    </Flex>
  );
}
