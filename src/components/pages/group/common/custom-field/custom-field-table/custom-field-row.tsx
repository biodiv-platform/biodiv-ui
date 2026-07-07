import { Box, Button } from "@chakra-ui/react";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import DeleteIcon from "@icons/delete";
import EditIcon from "@icons/edit";
import useTranslation from "next-translate/useTranslation";
import { LuGripVertical } from "react-icons/lu";

const BooleanIcon = ({ isChecked }) => (
  <Box as="td" w="8rem">
    {isChecked ? (
      <CheckIcon color="green.500" boxSize={8} />
    ) : (
      <CrossIcon color="red.500" boxSize={8} />
    )}
  </Box>
);

export function CustomFieldRow({
  itemDetails,
  onDelete,
  onEdit,
  dragHandleProps,
  innerRef,
  style
}) {
  const { t } = useTranslation();
  const {
    customFields: { dataType, fieldType, name },
    allowedParticipation,
    isMandatory
  } = itemDetails;

  return (
    <tr ref={innerRef} style={style}>
      <Box as="td" w="16rem">
        <Box as="span" display="inline-flex" alignItems="center">
          <Box as="span" cursor="grab" mr={2} {...dragHandleProps}>
            <LuGripVertical />
          </Box>
          {name}
        </Box>
      </Box>
      <td>{dataType}</td>
      <td>{fieldType}</td>
      <BooleanIcon isChecked={isMandatory} />
      <BooleanIcon isChecked={allowedParticipation} />
      <td>
        <Button onClick={onDelete} variant="plain" colorPalette="red" ml={2}>
          <DeleteIcon />
          {t("common:delete")}
        </Button>
      </td>
      {itemDetails.customFields.authorId && (
        <td>
          <Button onClick={onEdit} variant="plain" colorPalette="blue" ml={2}>
            <EditIcon />
            {t("common:edit")}
          </Button>
        </td>
      )}
    </tr>
  );
}
