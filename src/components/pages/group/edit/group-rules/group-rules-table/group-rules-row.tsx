import { Box, Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import DeleteIcon from "@icons/delete";
import React from "react";

const GroupRulesRow = ({ itemDetails, onDelete }) => {
  const { t } = useTranslation();
  const { name, value } = itemDetails;

  return (
    <tr>
      <td>{name}</td>
      <td>
        <Box userSelect="all" className="elipsis">
          {value}
        </Box>
      </td>
      <td>
        <Button
          onClick={onDelete}
          variant="link"
          colorScheme="red"
          leftIcon={<DeleteIcon />}
          ml={2}
        >
          {t("DELETE")}
        </Button>
      </td>
    </tr>
  );
};

export default GroupRulesRow;
