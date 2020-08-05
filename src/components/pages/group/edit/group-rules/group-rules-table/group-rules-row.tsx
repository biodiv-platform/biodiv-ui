import { Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

const CustomFieldRow = ({ itemDetails, onDelete }) => {
  const { t } = useTranslation();
  const {
    customFields: { dataType, fieldType, name }
  } = itemDetails;

  return (
    <tr>
      <td>{name}</td>
      <td>{dataType}</td>
      <td>{fieldType}</td>
      <td>
        <Button onClick={onDelete} variant="link" variantColor="red" leftIcon="delete" ml={2}>
          {t("DELETE")}
        </Button>
      </td>
    </tr>
  );
};

export default CustomFieldRow;
