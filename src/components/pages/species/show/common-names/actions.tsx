import { Box, Button, ButtonGroup, Flex, Td, Tr } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import { SPECIES_NAME_ADD, SPECIES_NAME_DELETE, SPECIES_NAME_EDIT } from "@static/events";
import React from "react";
import { emit } from "react-gbus";

export function CommonNameAdd() {
  const { t } = useTranslation();
  const handleOnAdd = () => emit(SPECIES_NAME_ADD, {});

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

export function CommonNameEditButtons({ commonName }) {
  const { t } = useTranslation();

  const handleOnEdit = () => emit(SPECIES_NAME_EDIT, commonName);
  const handleOnDelete = () => emit(SPECIES_NAME_DELETE, commonName);

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>{commonName.name}</Box>
      <ButtonGroup variant="outline" size="xs">
        <Button colorScheme="blue" leftIcon={<EditIcon />} onClick={handleOnEdit}>
          {t("EDIT")}
        </Button>
        <Button colorScheme="red" leftIcon={<DeleteIcon />} onClick={handleOnDelete}>
          {t("DELETE")}
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
