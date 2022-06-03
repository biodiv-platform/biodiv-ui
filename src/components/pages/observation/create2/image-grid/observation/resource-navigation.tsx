import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function ResourceNavigation({ index, setIndex, size, onDelete }) {
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
        icon={<ChevronLeftIcon />}
        isDisabled={index === 0}
        onClick={handleOnPrev}
        title={t("common:prev")}
      />
      <IconButton
        aria-label={t("common:delete")}
        colorScheme="red"
        icon={<DeleteIcon />}
        isDisabled={size === 1}
        onClick={handleOnDelete}
        title={t("common:delete")}
      />
      <IconButton
        aria-label={t("common:next")}
        icon={<ChevronRightIcon />}
        isDisabled={index === size - 1}
        onClick={handleOnNext}
        title={t("common:next")}
      />
    </ButtonGroup>
  );
}
