import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import React from "react";

export default function FieldEditActionButtons({ onEdit, onDelete, p = 2, pb = 0 }) {
  const { t } = useTranslation();

  return (
    <Box p={p} pb={pb} className="actions">
      <ButtonGroup size="xs" variant="outline" spacing={2}>
        <Button onClick={onEdit} colorScheme="blue" leftIcon={<EditIcon />}>
          {t("EDIT")}
        </Button>
        <Button onClick={onDelete} colorScheme="red" leftIcon={<DeleteIcon />}>
          {t("DELETE")}
        </Button>
      </ButtonGroup>
    </Box>
  );
}
