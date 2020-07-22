import { Box, Button, ButtonGroup } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axRemoveCustomField, axReorderCustomField } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import arrayMove from "array-move";
import React, { useEffect, useState } from "react";

import CustomFieldListItems from "./custom-field-items";

const CustomFieldTable = ({ userGroupId, customFields, setCustomFields, setIsCreate }) => {
  const [canReorder, setCanReorder] = useState<boolean>();
  const { t } = useTranslation();

  useEffect(() => {
    setCustomFields(customFields.sort((a, b) => a.displayOrder - b.displayOrder));
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setCustomFields(arrayMove(customFields, oldIndex, newIndex));
    setCanReorder(true);
  };

  const handleReorderCustomField = async () => {
    const payload = customFields.map((field, displayOrder) => ({
      cfId: field.customFields.id,
      displayOrder
    }));

    const { success } = await axReorderCustomField(userGroupId, payload);
    if (success) {
      notification(t("GROUP.CUSTOM_FIELD.REORDER.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.CUSTOM_FIELD.REORDER.FAILURE"));
    }
    setCanReorder(false);
  };

  const removeCustomField = async (index) => {
    const { success } = await axRemoveCustomField(userGroupId, index);
    if (success) {
      setCustomFields(customFields.filter(({ customFields: { id } }) => id !== index));
      notification(t("GROUP.CUSTOM_FIELD.REMOVE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.CUSTOM_FIELD.REMOVE.FAILURE"), NotificationType.Error);
    }
  };

  return (
    <Box w="full" overflowX="auto" className="fade">
      <table style={{ minWidth: "750px" }} className="table table-bordered">
        <thead>
          <tr>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.NAME")}</th>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.DATA_TYPE")}</th>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.INPUT_TYPE")}</th>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.MANDATORY")}</th>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.PARTICIPATION")}</th>
            <th>{t("GROUP.CUSTOM_FIELD.TABLE.ACTIONS")}</th>
          </tr>
        </thead>
        <CustomFieldListItems
          removeCustomField={removeCustomField}
          helperClass="sorting-row"
          customFieldList={customFields}
          onSortEnd={onSortEnd}
        />
      </table>
      <ButtonGroup spacing={4} mt={4}>
        <Button variantColor="blue" onClick={() => setIsCreate(true)} leftIcon="add">
          {t("GROUP.CUSTOM_FIELD.CREATE")}
        </Button>
        <Button
          variantColor="blue"
          leftIcon="check"
          float="right"
          hidden={!canReorder}
          onClick={handleReorderCustomField}
        >
          {t("GROUP.CUSTOM_FIELD.SAVE_ORDER")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default CustomFieldTable;
