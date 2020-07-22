import { Box, Button, Icon } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";
import { SortableElement } from "react-sortable-hoc";

const BooleanIcon = ({ isChecked }) => (
  <Box as="td" w="8rem">
    <Icon name={isChecked ? "ibpcheck" : "ibpcross"} color={isChecked ? "green.500" : "red.500"} />
  </Box>
);

const CustomFieldRow = SortableElement(({ itemDetails, onDelete }) => {
  const { t } = useTranslation();
  const {
    customFields: { dataType, fieldType, name },
    allowedParticipation,
    isMandatory
  } = itemDetails;

  return (
    <tr>
      <Box as="td" w="16rem">
        <Icon name="drag-handle" cursor="move" /> {name}
      </Box>
      <td>{dataType}</td>
      <td>{fieldType}</td>
      <BooleanIcon isChecked={isMandatory} />
      <BooleanIcon isChecked={allowedParticipation} />
      <td>
        <Button onClick={onDelete} variant="link" variantColor="red" leftIcon="delete" ml={2}>
          {t("DELETE")}
        </Button>
      </td>
    </tr>
  );
});

export default CustomFieldRow;
