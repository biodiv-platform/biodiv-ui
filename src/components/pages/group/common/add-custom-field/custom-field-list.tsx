import React, { useState } from "react";
import { Stack, Heading, Text, SimpleGrid, IconButton } from "@chakra-ui/core";
import notification, { NotificationType } from "@utils/notification";
import { axRemoveCustomField } from "@services/usergroup.service";
import useTranslation from "@configs/i18n/useTranslation";

function Feature({ customField, onDelete }) {
  return (
    <SimpleGrid color="grey" p={3} columns={6} shadow="md" borderWidth="1px">
      <Text>{customField.name}</Text>
      <Text>{customField.dataType}</Text>
      <Text>{customField.fieldType}</Text>
      <Text>{customField.allowedParticipation ? "Yes" : "No"}</Text>
      <Text>{customField.isMandatory ? "Yes" : "No"}</Text>
      <IconButton
        aria-label="delete-field"
        onClick={onDelete}
        variant="ghost"
        variantColor="red"
        icon="delete"
      />
    </SimpleGrid>
  );
}

export default function CustomFieldList({ userGroupId, customFieldList }) {
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
  return (
    <Stack spacing={4}>
      <SimpleGrid p={3} alignItems="center" columns={6} shadow="md" borderWidth="1px">
        <Heading size="md">Name</Heading>
        <Heading size="md">Data Type</Heading>
        <Heading size="md">Input Type</Heading>
        <Heading size="md">Participation</Heading>
        <Heading size="md">Mandatory</Heading>
      </SimpleGrid>
      {list.map((item) => (
        <Feature
          key={item.customFields.id}
          onDelete={() => {
            deleteCustomField(item.customFields.id);
          }}
          customField={item.customFields}
        />
      ))}
    </Stack>
  );
}
