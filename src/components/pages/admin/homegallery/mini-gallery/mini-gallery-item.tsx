import { Badge, Box, Flex, Heading, IconButton } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import useGlobalState from "@/hooks/use-global-state";
import DeleteIcon from "@/icons/delete";
import EditIcon from "@/icons/edit";
import { axRemoveMiniGallery } from "@/services/utility.service";
import notification, { NotificationType } from "@/utils/notification";

export default function MiniGalleryItem({ item, index, onEdit, onDelete }) {
  const { t } = useTranslation();
  const { languageId } = useGlobalState();
  const [, setEditData] = useState(item.gallerySlider);
  const [, setGalleryList] = useState(item.gallerySlider);

  useEffect(() => {
    setGalleryList(item.gallerySlider);
    setEditData(item.gallerySlider);
  }, [item.gallerySlider]);

  const handleDelete = async () => {
    const { success } = await axRemoveMiniGallery(item.galleryId);
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
      <Box
        mb={8}
        bg="white"
        border="1px solid var(--chakra-colors-gray-300)"
        borderRadius="md"
        width="full"
      >
        <Flex flex={1} align="center" justify="space-between" pl={4}>
          <Heading as="h2" fontSize="1.2rem">
            {(() => {
              const translationsMap = Object.fromEntries(
                item.translations.map((t) => [Number(t.languageId), t])
              );

              return `${
                translationsMap?.[languageId]?.title ||
                translationsMap?.[SITE_CONFIG.LANG.DEFAULT_ID]?.title
              } Setup`;
            })()}
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
      </Box>
    </Flex>
  );
}
