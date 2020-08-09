import { Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

const GroupRulesRow = ({ itemDetails, onDelete }) => {
  const { t } = useTranslation();
  const { name, value } = itemDetails;

  return (
    <tr>
      <td>{name}</td>
      <td>{value}</td>
      <td>
        <Button onClick={onDelete} variant="link" variantColor="red" leftIcon="delete" ml={2}>
          {t("DELETE")}
        </Button>
      </td>
    </tr>
  );
};

export default GroupRulesRow;
