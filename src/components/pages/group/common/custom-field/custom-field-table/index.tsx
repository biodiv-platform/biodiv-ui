import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import AddIcon from "@icons/add";
import CheckIcon from "@icons/check";
import { axRemoveCustomField, axReorderCustomField } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import { arrayMoveImmutable } from "array-move";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import CustomFieldListItems from "./custom-field-items";

const CustomFieldTable = ({
  userGroupId,
  customFields,
  setCustomFields,
  setIsCreate,
  setIsEdit,
  setEditCustomFieldData
}) => {
  const [canReorder, setCanReorder] = useState<boolean>();
  const { t } = useTranslation();

  useEffect(() => {
    setCustomFields(customFields.sort((a, b) => a.displayOrder - b.displayOrder));
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setCustomFields(arrayMoveImmutable(customFields, oldIndex, newIndex));
    setCanReorder(true);
  };

  const handleReorderCustomField = async () => {
    const payload = customFields.map((field, displayOrder) => ({
      cfId: field.customFields.id,
      displayOrder
    }));

    const { success } = await axReorderCustomField(userGroupId, payload);
    if (success) {
      notification(t("group:custom_field.reorder.success"), NotificationType.Success);
    } else {
      notification(t("group:custom_field.reorder.failure"));
    }
    setCanReorder(false);
  };

  const removeCustomField = async (index) => {
    const { success } = await axRemoveCustomField(userGroupId, index);
    if (success) {
      setCustomFields(customFields.filter(({ customFields: { id } }) => id !== index));
      notification(t("group:custom_field.remove.success"), NotificationType.Success);
    } else {
      notification(t("group:custom_field.remove.failure"), NotificationType.Error);
    }
  };

  const customFieldDetails = async (index) => {
    setIsEdit(true);
    setEditCustomFieldData(customFields.filter((cfData) => cfData.customFields.id == index));
  };

  return (
    <Box w="full" overflowX="auto" className="fade">
      <table style={{ minWidth: "750px" }} className="table table-bordered">
        <thead>
          <tr>
            <th>{t("group:custom_field.table.name")}</th>
            <th>{t("group:custom_field.table.data_type")}</th>
            <th>{t("group:custom_field.table.input_type")}</th>
            <th>{t("group:custom_field.table.mandatory")}</th>
            <th>{t("group:custom_field.table.participation")}</th>
            <th>{t("group:custom_field.table.actions")}</th>
          </tr>
        </thead>
        <CustomFieldListItems
          removeCustomField={removeCustomField}
          customFieldDetails={customFieldDetails}
          helperClass="sorting-row"
          customFieldList={customFields}
          onSortEnd={onSortEnd}
        />
      </table>
      <ButtonGroup spacing={4} mt={4}>
        <Button colorScheme="blue" onClick={() => setIsCreate(true)} leftIcon={<AddIcon />}>
          {t("group:custom_field.create")}
        </Button>
        <Button
          colorScheme="blue"
          leftIcon={<CheckIcon />}
          float="right"
          hidden={!canReorder}
          onClick={handleReorderCustomField}
        >
          {t("group:custom_field.save_order")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default CustomFieldTable;
