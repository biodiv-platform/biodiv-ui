import { Heading, IconButton, SimpleGrid, Stack, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axRemoveCustomField } from "@services/customfield.service";
import notification, { NotificationType } from "@utils/notification";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import React, { useEffect, useState } from "react";

const CustomFieldDetails = SortableElement(({ itemDetails, onDelete }) => {
  const { customFields } = itemDetails;
  return (
    <SimpleGrid color="grey" p={3} columns={6} shadow="md" borderWidth="1px">
      <Text>{customFields.name}</Text>
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

const CustomFieldList = SortableContainer(({ userGroupId, customFieldList }) => {
  const [list, setList] = useState(customFieldList);
  const { t } = useTranslation();

  const deleteCustomField = async (index) => {
    const { success } = await axRemoveCustomField(userGroupId, index);
    if (success) {
      setList(list.filter((item) => item.customFields.id !== index));
      notification(t("GROUP.EDIT.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("GROUP.EDIT.ERROR", NotificationType.Error));
    }
  };

  useEffect(() => {
    setList(customFieldList);
  }, [customFieldList]);

  return (
    <Stack spacing={4}>
      <SimpleGrid p={3} alignItems="center" columns={6} shadow="md" borderWidth="1px">
        <Heading size="md">Name</Heading>
        <Heading size="md">Data Type</Heading>
        <Heading size="md">Input Type</Heading>
        <Heading size="md">Participation</Heading>
        <Heading size="md">Mandatory</Heading>
      </SimpleGrid>
      {list.map((item, index) => (
        <CustomFieldDetails
          key={item.customFields.id}
          index={index}
          onDelete={() => deleteCustomField(item.customFields.id)}
          itemDetails={item}
        />
      ))}
    </Stack>
  );
});

const SortableCustomFieldList = (props) => {
  const [items, setItems] = useState(props.customFieldList);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return <CustomFieldList {...props} onSortEnd={onSortEnd} />;
};

export default SortableCustomFieldList;
