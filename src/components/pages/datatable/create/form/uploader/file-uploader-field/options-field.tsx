import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { OBSERVATION_FIELDS } from "@static/observation-create";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";


// formats field mapping  dropdown options
const formatOptions = (options, observationConfig) => {
  const { customFields, traits } = observationConfig;
  const formatOptions = [options,
    { label: "Traits", options: traits.map((item) => ({ label: item.name, value: item.name })) }]
  return customFields.length > 0 ?
    [...formatOptions, { label: "Custom Field", options: customFields.map((item) => ({ label: item.name, value: item.name })) }] : formatOptions;
}

export default function Fields({ name, fieldMapping, showMapping, setShowMapping, observationConfig }) {
  const { t } = useTranslation();
  const [tabelHeaders, setTableHeaders] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState<any[]>([]);
  const { fields, append, remove } = useFieldArray({ name });
  const form = useFormContext();

  const resetMappingTable = () => {
    setTableHeaders([]);
    setFieldValues([]);
    remove();
  };

  useEffect(() => {
    resetMappingTable();

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
    resetMappingTable();
    form.setValue("filename", "");
    setShowMapping(false);
  };

  return (
    <ToggleablePanel icon="🧩" title={t("datatable:field_mapping_table")}>
      <Box p={4} pb={0}>
        <Stack m={2} direction="row-reverse">
          <Button colorScheme="blue" onClick={toggleFieldMapping} leftIcon={<ArrowBackIcon />}>
            {t("datatable:upload_again")}
          </Button>
        </Stack>
        <Box style={{ overflowX: "scroll", width: "100%" }}>
          <Table mt={4} variant="striped" colorScheme="gray" size="sm">
            <Thead>
              <Tr>
                {tabelHeaders.map((item, index) => (
                  <Th key={index}>{item}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {fields.map((field, index) => (
                  <Td key={field.id}>
                    <SelectInputField
                      name={`columnsMapping.${index}.fieldKey`}
                      label={t("common:actions.flag.category")}
                      options={formatOptions(OBSERVATION_FIELDS, observationConfig)}
                    />
                  </Td>
                ))}
              </Tr>
              {fieldValues.map((tableData, _index) => (
                <Tr key={_index}>
                  {tableData.map((data, index) => (
                    <Td key={index}>{data}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </ToggleablePanel>
  );
}
