import { Button, ButtonGroup, IconButton } from "@chakra-ui/react";
import DeleteIcon from "@icons/delete";
import LayersIcon from "@icons/layers";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function ResourceNavigation({ index, setIndex, size, onDelete, onReorder }) {
  const { t } = useTranslation();

  const handleOnDelete = () => {
    if (size - 1 === index) setIndex(0); // Move to zero if being deleted resource index is last
    onDelete(index);
  };

  const handleOnNext = () => setIndex(index + 1);
  const handleOnPrev = () => setIndex(index - 1);

  return (
    <ButtonGroup size="xs" position="absolute" bottom={0} right={0} m={2}>
      <IconButton
        aria-label={t("common:prev")}
        disabled={index === 0}
        onClick={handleOnPrev}
        title={t("common:prev")}
      >
        <LuChevronLeft />
      </IconButton>
      <IconButton
        aria-label={t("common:delete")}
        colorPalette="red"
        disabled={size === 1}
        onClick={handleOnDelete}
        title={t("common:delete")}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        aria-label={t("common:next")}
        disabled={index === size - 1}
        onClick={handleOnNext}
        title={t("common:next")}
      >
        <LuChevronRight />
      </IconButton>
      <Button
        aria-label={t("observation:manage_resources")}
        onClick={onReorder}
        title={t("observation:manage_resources")}
        // children={size}
      >
        <LayersIcon />
      </Button>
    </ButtonGroup>
  );
}
