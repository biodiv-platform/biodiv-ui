import { Box, Button, ButtonGroup, Flex, IconButton, Td, Tr } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import { SPECIES_SYNONYM_ADD, SPECIES_SYNONYM_DELETE, SPECIES_SYNONYM_EDIT } from "@static/events";
import React from "react";
import { emit } from "react-gbus";

export function SynonymAdd() {
  const { t } = useTranslation();
  const handleOnAdd = () => emit(SPECIES_SYNONYM_ADD, {});

  return (
    <Tr>
      <Td colSpan={2}>
        <Button
          variant="outline"
          size="xs"
          colorScheme="green"
          leftIcon={<AddIcon />}
          onClick={handleOnAdd}
        >
          {t("ADD")}
        </Button>
      </Td>
    </Tr>
  );
}

export function SynonymEditButtons({ synonym }) {
  const { t } = useTranslation();

  const handleOnEdit = () => emit(SPECIES_SYNONYM_EDIT, synonym);
  const handleOnDelete = () => emit(SPECIES_SYNONYM_DELETE, synonym);

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>{synonym.normalizedForm}</Box>
      <ButtonGroup spacing={0} variant="link">
        <IconButton
          colorScheme="blue"
          icon={<EditIcon />}
          onClick={handleOnEdit}
          aria-label={t("EDIT")}
          title={t("EDIT")}
        />
        <IconButton
          colorScheme="red"
          icon={<DeleteIcon />}
          onClick={handleOnDelete}
          aria-label={t("DELETE")}
          title={t("DELETE")}
        />
      </ButtonGroup>
    </Flex>
  );
}
