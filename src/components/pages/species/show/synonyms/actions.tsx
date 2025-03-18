import { Box, Button, ButtonGroup, Flex, IconButton, Td, Tr } from "@chakra-ui/react";
import ScientificName from "@components/@core/scientific-name";
import AddIcon from "@icons/add";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import { SPECIES_SYNONYM_ADD, SPECIES_SYNONYM_DELETE, SPECIES_SYNONYM_EDIT } from "@static/events";
import useTranslation from "next-translate/useTranslation";
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
          colorPalette="green"
          leftIcon={<AddIcon />}
          onClick={handleOnAdd}
        >
          {t("common:add")}
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
      <Box>
        <ScientificName value={synonym.italicisedForm} />
      </Box>
      <ButtonGroup spacing={0} variant="link">
        <IconButton
          colorPalette="blue"
          icon={<EditIcon />}
          onClick={handleOnEdit}
          aria-label={t("common:edit")}
          title={t("common:edit")}
        />
        <IconButton
          colorPalette="red"
          icon={<DeleteIcon />}
          onClick={handleOnDelete}
          aria-label={t("common:delete")}
          title={t("common:delete")}
        />
      </ButtonGroup>
    </Flex>
  );
}
