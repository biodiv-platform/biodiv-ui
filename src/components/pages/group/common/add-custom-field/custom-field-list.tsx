import { Button, Heading, Icon, IconButton, SimpleGrid, Stack, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axRemoveCustomField, axReorderCustomField } from "@services/customfield.service";
import notification, { NotificationType } from "@utils/notification";
import arrayMove from "array-move";
import React, { useEffect, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const CustomFieldDetails = SortableElement(({ itemDetails, onDelete }) => {
  const { customFields } = itemDetails;
  return (
    <SimpleGrid color="grey" spacing={10} p={3} columns={6} shadow="md" borderWidth="1px">
      <Text>
        <Icon name="drag-handle" mr={3} />
        {customFields.name}
      </Text>
      <Text>{customFields.dataType}</Text>
      <Text>{customFields.fieldType}</Text>
      <Text>{itemDetails.allowedParticipation ? "Yes" : "No"}</Text>
      <Text>{itemDetails.isMandatory ? "Yes" : "No"}</Text>
      <IconButton
        aria-label="delete-field"
        onClick={onDelete}
        variant="ghost"
        variantColor="red"
        icon="delete"
      />
    </SimpleGrid>
  );
});

const CustomFieldList = SortableContainer(
  ({ customFieldList, removeCustomField, reorderCustomField, reorder }) => {
    return (
      <>
        {reorder && (
          <Button variantColor="blue" onClick={reorderCustomField} mb={4}>
            Reorder CustomField
          </Button>
        )}
        <Stack spacing={4} minWidth={750}>
          <SimpleGrid p={3} alignItems="center" columns={6} shadow="md" borderWidth="1px">
            <Heading size="md">Name</Heading>
            <Heading size="md">Data Type</Heading>
            <Heading size="md">Input Type</Heading>
            <Heading size="md">Participation</Heading>
            <Heading size="md">Mandatory</Heading>
          </SimpleGrid>
          {customFieldList.map((item, index) => (
            <CustomFieldDetails
              key={item.customFields.id}
              index={index}
              onDelete={() => removeCustomField(item.customFields.id)}
              itemDetails={item}
            />
          ))}
        </Stack>
      </>
    );
  }
);

const SortableCustomFieldList = ({ userGroupId, customFieldList }) => {
  const [items, setItems] = useState(customFieldList);
  const [reorder, setReorder] = useState<boolean>();
  const { t } = useTranslation();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));
    setReorder(true);
  };

  const handleReorderCustomField = async () => {
    const payload = items.map((field, index) => ({
      cfId: field.customFields.id,
      displayOrder: index
    }));
    const { success } = await axReorderCustomField(userGroupId, payload);
    if (success) {
      notification(t("GROUP.CUSTOM_FIELD.REORDER_SUCCESS"), NotificationType.Success);
      setReorder(false);
    } else {
      notification(t("GROUP.CUSTOM_FIELD.REORDER_FAILURE"));
      setReorder(false);
    }
  };

  const removeCustomField = async (index) => {
    const { success } = await axRemoveCustomField(userGroupId, index);
    if (success) {
      setItems(items.filter((item) => item.customFields.id !== index));
      notification(t("GROUP.CUSTOM_FIELD.REMOVE_SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.CUSTOM_FIELD.REMOVE_FAILURE", NotificationType.Error));
    }
  };

  useEffect(() => setItems(customFieldList.sort((a, b) => a.displayOrder - b.displayOrder)), []);
  return (
    <CustomFieldList
      removeCustomField={removeCustomField}
      reorderCustomField={handleReorderCustomField}
      reorder={reorder}
      customFieldList={items}
      onSortEnd={onSortEnd}
    />
  );
};

export default SortableCustomFieldList;
