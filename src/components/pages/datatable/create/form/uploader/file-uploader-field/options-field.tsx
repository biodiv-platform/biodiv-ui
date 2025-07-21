import { Box, Button, Stack, Table } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useGlobalState from "@hooks/use-global-state";
import { OBSERVATION_FIELDS } from "@static/observation-create";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LuMoveLeft } from "react-icons/lu";

import { Field } from "@/components/ui/field";

// formats field mapping  dropdown options
const formatOptions = (options, observationConfig, userGroupId) => {
  const { customFields, traits } = observationConfig;
  const formatOptions = [
    options,
    { label: "Traits", options: traits.map((item) => ({ label: item.name, value: item.name })) }
  ];
  return userGroupId
    ? [
        ...formatOptions,
        {
          label: "Custom Field",
          options: customFields.map((item) => ({ label: item.name, value: item.name }))
        }
      ]
    : formatOptions;
};

export default function Fields({
  name,
  fieldMapping,
  showMapping,
  setShowMapping,
  observationConfig
}) {
  const { t } = useTranslation();
  const [tabelHeaders, setTableHeaders] = useState<string[]>([]);
  const { currentGroup } = useGlobalState();
  const [fieldValues, setFieldValues] = useState<any[]>([]);
  const { fields, append, remove } = useFieldArray({ name });
  const form = useFormContext();

  useEffect(() => {
    remove();
    const { rowData, headerData } = fieldMapping;

    if (rowData && headerData && showMapping) {
      setTableHeaders(headerData);
      fieldMapping.rowData.map((item) => {
        const row = reorderRowData(item, headerData);
        setFieldValues((prevState) => [...prevState, Object.values(row)]);
      });

      append(Object.keys(rowData[0]).map(() => ({ fieldKey: undefined })));
    }
  }, [fieldMapping, showMapping]);

  const reorderRowData = (item: any, headers: string[]) => {
    const row = {};
    headers.map((header) => {
      row[header] = item[header];
    });
    return row;
  };

  const toggleFieldMapping = () => {
    remove();
    form.setValue("filename", "");
    setShowMapping(false);
  };

  return (
    <Field invalid={!form.formState.isValid}>
      <ToggleablePanel icon="🧩" title={t("datatable:field_mapping_table")}>
        <Box p={4} pb={0}>
          <Stack m={2} alignItems="center" justifyContent="space-between" direction="row">
            {form.formState?.errors[name]?.message ? (
              <Field errorText={form.formState?.errors[name]?.message?.toString()} />
            ) : (
              <Field color="gray.600" helperText={t("datatable:field_mapping_hint")} />
            )}
            <Button colorPalette="blue" onClick={toggleFieldMapping}>
              <LuMoveLeft />
              {t("datatable:upload_again")}
            </Button>
          </Stack>
          <Box style={{ overflowX: "scroll", width: "100%" }}>
            <Table.Root mt={4} striped colorPalette="gray" size="sm">
              <Table.Header>
                <Table.Row>
                  {tabelHeaders.map((item, index) => (
                    <Table.ColumnHeader key={index}>{item}</Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  {fields.map((field, index) => (
                    <Table.Cell key={field.id}>
                      <SelectInputField
                        shouldPortal={true}
                        name={`columnsMapping.${index}.fieldKey`}
                        label={t("common:actions.flag.category")}
                        options={formatOptions(
                          OBSERVATION_FIELDS,
                          observationConfig,
                          currentGroup?.id
                        )}
                      />
                    </Table.Cell>
                  ))}
                </Table.Row>
                {fieldValues.map((tableData, _index) => (
                  <Table.Row key={_index}>
                    {tableData.map((data, index) => (
                      <Table.Cell key={index}>{data}</Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>
      </ToggleablePanel>
    </Field>
  );
}
