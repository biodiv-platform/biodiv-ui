import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function FieldEditActionButtons({ onEdit, onDelete, p = 2, pb = 0 }) {
  const { t } = useTranslation();

  return (
    <Box p={p} pb={pb} className="actions">
      <ButtonGroup size="xs" variant="outline" spacing={2}>
        <Button onClick={onEdit} colorScheme="blue" leftIcon={<EditIcon />}>
          {t("common:edit")}
        </Button>
        <Button onClick={onDelete} colorScheme="red" leftIcon={<DeleteIcon />}>
          {t("common:delete")}
        </Button>
      </ButtonGroup>
    </Box>
  );
}
