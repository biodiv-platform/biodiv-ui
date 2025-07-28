import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import GallerySetupFrom from "@/components/pages/group/edit/homepage-customization/gallery-setup/gallery-setup-form";
import AddIcon from "@/icons/add";
import DeleteIcon from "@/icons/delete";
import EditIcon from "@/icons/edit";
import { axRemoveMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

import GalleryEditForm from "../gallery-setup/gallery-setup-form/editform";
import GallerySetupTable from "../gallery-setup/gallery-setup-tabel";
import CreateMiniGalleryForm from "./create";
import EditMiniGalleryForm from "./edit";

export default function MiniGallery({ miniGallery, setMiniGallery, languages }) {
  const { t } = useTranslation();
  const [isGalleryCreate, setIsGalleryCreate] = useState(false);
  const [isGalleryEdit, setIsGalleryEdit] = useState(false);
  const [editGalleryData, setEditGalleryData] = useState(miniGallery);
  const [editIndex, setEditIndex] = useState(0);
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
          />
        </Box>
      ) : isGalleryCreate ? (
        <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
          <CreateMiniGalleryForm
            setIsCreate={setIsGalleryCreate}
            miniGalleryList={miniGallery}
            setMiniGalleryList={setMiniGallery}
          />
        </Box>
      ) : (
        <>
          {miniGallery?.map((item, index) => {
            const [isCreate, setIsCreate] = useState(false);
            const [isEdit, setIsEdit] = useState(false);
            const [editData, setEditData] = useState(item?.gallerySlider);
            const [galleryList, setGalleryList] = useState(
              Object.entries(item?.gallerySlider || {}).sort((a, b) => {
                const aOrder = parseInt(a[0].split("|")[1], 10);
                const bOrder = parseInt(b[0].split("|")[1], 10);
                return aOrder - bOrder;
              })
            );
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
                            variant={"plain"}
                            size={"xl"}
                            onClick={() => {
                              setIsGalleryEdit(true);
                              setEditGalleryData(item);
                              setEditIndex(index);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            colorPalette="red"
                            className="action"
                            aria-label={t("common:delete")}
                            title={t("common:delete")}
                            variant={"plain"}
                            size={"xl"}
                            onClick={async () => {
                              const { success } = await axRemoveMiniGallery(item.id);
                              if (success) {
                                notification(
                                  t(
                                    "group:homepage_customization.mini_gallery_setup.delete_success"
                                  ),
                                  NotificationType.Success
                                );
                                setMiniGallery(miniGallery.filter((_, idx) => idx !== index));
                              } else {
                                notification(
                                  t("group:homepage_customization.mini_gallery_setup.delete_error"),
                                  NotificationType.Error
                                );
                              }
                            }}
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
                            setGalleryList={setGalleryList}
                            editGalleryData={editData}
                            languages={languages}
                          />
                        ) : isCreate ? (
                          <GallerySetupFrom
                            setIsCreate={setIsCreate}
                            galleryList={galleryList}
                            setGalleryList={setGalleryList}
                            languages={languages}
                            group={false}
                            galleryId = {item.id}
                          />
                        ) : (
                          <GallerySetupTable
                            setIsCreate={setIsCreate}
                            setGalleryList={setGalleryList}
                            galleryList={galleryList}
                            setIsEdit={setIsEdit}
                            setEditGalleryData={setEditData}
                          />
                        )}
                      </Box>
                    </AccordionItemContent>
                  </AccordionItem>
                </AccordionRoot>
              </Flex>
            );
          })}
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
