import { Box, Button } from "@chakra-ui/react";
import DeleteIcon from "@icons/delete";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const GroupRulesRow = ({ itemDetails, onDelete }) => {
  const { t } = useTranslation();
  const { name, value } = itemDetails;

  return (
    <tr>
      <td>{name}</td>
      <td>
        <Box userSelect="all" className="elipsis">
          {name == "traitRule" && !itemDetails.id
            ? value.split(":")[0].split("|")[2] + " : " + value.split(":")[1].split("|")[1]
            : value}
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
          {t("common:delete")}
        </Button>
      </td>
    </tr>
  );
};

export default GroupRulesRow;
