import { Box, Button, ButtonGroup, Flex, IconButton, Td, Tr } from "@chakra-ui/react";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import StarOutlineIcon from "@icons/star-outline";
import {
  SPECIES_NAME_ADD,
  SPECIES_NAME_DELETE,
  SPECIES_NAME_EDIT,
  SPECIES_NAME_PREFERRED
} from "@static/events";
import useTranslation from "next-translate/useTranslation";
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
          {t("common:add")}
        </Button>
      </Td>
    </Tr>
  );
}

export function CommonNameEditButtons({ commonName }) {
  const { t } = useTranslation();

  const handleOnEdit = () => emit(SPECIES_NAME_EDIT, commonName);
  const handleOnDelete = () => emit(SPECIES_NAME_DELETE, commonName);
  const handleOnPreferred = () => emit(SPECIES_NAME_PREFERRED, commonName);

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>{commonName.name}</Box>
      <ButtonGroup spacing={0} variant="link">
        <IconButton
          colorScheme="blue"
          icon={<EditIcon />}
          onClick={handleOnEdit}
          aria-label={t("common:edit")}
          title={t("common:edit")}
        />
        <IconButton
          colorScheme="red"
          icon={<DeleteIcon />}
          onClick={handleOnDelete}
          aria-label={t("common:delete")}
          title={t("common:delete")}
        />
        <IconButton
          colorScheme="orange"
          leftIcon={<StarOutlineIcon />}
          onClick={handleOnPreferred}
          aria-label={t("species:common_name.preferred.title")}
          title={t("species:common_name.preferred.title")}
        />
      </ButtonGroup>
    </Flex>
  );
}
