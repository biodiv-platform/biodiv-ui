import { Box, Button, ButtonGroup, Flex, IconButton, Table } from "@chakra-ui/react";
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
    <Table.Row>
      <Table.Cell colSpan={2}>
        <Button variant="outline" size="xs" colorPalette="green" onClick={handleOnAdd}>
          <AddIcon />
          {t("common:add")}
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

export function CommonNameEditButtons({ commonName, showPreferred }) {
  const { t } = useTranslation();

  const handleOnEdit = () => emit(SPECIES_NAME_EDIT, commonName);
  const handleOnDelete = () => emit(SPECIES_NAME_DELETE, commonName);
  const handleOnPreferred = () => emit(SPECIES_NAME_PREFERRED, commonName);

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>{commonName.name}</Box>
      <ButtonGroup gap={0} variant="plain">
        <IconButton
          colorPalette="blue"
          onClick={handleOnEdit}
          aria-label={t("common:edit")}
          title={t("common:edit")}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          colorPalette="red"
          onClick={handleOnDelete}
          aria-label={t("common:delete")}
          title={t("common:delete")}
        >
          <DeleteIcon />
        </IconButton>
        {showPreferred && (
          <IconButton
            colorPalette="orange"
            onClick={handleOnPreferred}
            aria-label={t("species:common_name.preferred.title")}
            title={t("species:common_name.preferred.title")}
          >
            <StarOutlineIcon />
          </IconButton>
        )}
      </ButtonGroup>
    </Flex>
  );
}
