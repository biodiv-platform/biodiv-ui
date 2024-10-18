import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import EditCustomField from "./custom-field-edit-from";
import AddCustomFieldForm from "./custom-field-form";
import CustomFieldTable from "./custom-field-table";

export default function GroupCustomField({ userGroupId, groupCustomField, allCustomField }) {
  const { t } = useTranslation();
  const [customFields, setCustomFields] = useState(groupCustomField || []);
  const [customFieldList, setCustomFieldList] = useState(allCustomField);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCustomFieldData, setEditCustomFieldData] = useState(groupCustomField);

  useEffect(() => {
    setCustomFieldList([...customFieldList, ...customFields]);
  }, [customFields]);

  return (
    <Box w="full" p={4} className="fadeInUp white-box" overflowX="auto">
      <BoxHeading>📜 {t("group:custom_field.title")}</BoxHeading>
      <Box p={3}>
        {isEdit ? (
          <EditCustomField
            editCustomFieldData={editCustomFieldData}
            setIsEdit={setIsEdit}
            setCustomFields={setCustomFields}
          />
        ) : isCreate ? (
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
            setIsEdit={setIsEdit}
            setEditCustomFieldData={setEditCustomFieldData}
          />
        )}
      </Box>
    </Box>
  );
}
