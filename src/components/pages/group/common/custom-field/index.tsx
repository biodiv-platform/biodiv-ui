import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import AddCustomFieldForm from "./custom-field-form";
import CustomFieldTable from "./custom-field-table";

export default function GroupCustomField({ userGroupId, groupCustomField, allCustomField }) {
  const { t } = useTranslation();
  const [customFields, setCustomFields] = useState(groupCustomField || []);
  const [customFieldList, setCustomFieldList] = useState(allCustomField);
  const [isCreate, setIsCreate] = useState(false);

  useEffect(() => {
    setCustomFieldList([...customFieldList, ...customFields]);
  }, [customFields]);

  return (
    <Accordion allowToggle={true}>
      <AccordionItem mb={8} bg="white" border="1px solid var(--chakra-colors-gray-300)" borderRadius="md">
        <AccordionButton _expanded={{ bg: "gray.100" }}>
          <Box flex={1} textAlign="left" fontSize="lg">
            📜 {t("group:custom_field.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel p={4}>
          {isCreate ? (
            <AddCustomFieldForm
              customFields={customFields}
              allCustomFields={customFieldList}
              setCustomFields={setCustomFields}
              setIsCreate={setIsCreate}
            />
          ) : (
            <CustomFieldTable
              userGroupId={userGroupId}
              customFields={customFields}
              setCustomFields={setCustomFields}
              setIsCreate={setIsCreate}
            />
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
