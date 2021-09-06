import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { OBSERVATION_FIELDS } from "@static/observation-create";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function Fields({ name, fieldMapping, showMapping, setShowMapping }) {
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
                      isRequired={true}
                      name={`columnsMapping.${index}.fieldKey`}
                      label={t("common:actions.flag.category")}
                      options={OBSERVATION_FIELDS}
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
