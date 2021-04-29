import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import Select from "@components/form/select";
import useTranslation from "@hooks/use-translation";
import { OBSERVATION_FIELDS } from "@static/observation-create";
import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

export default function Fields({ form, name, fieldMapping, showMapping, setShowMapping }) {
  const { t } = useTranslation();
  const [tabelHeaders, setTableHeaders] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState<any[]>([]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name
  });

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

      Object.keys(rowData[0]).map((item, index) => {
        append({ columnsMapping: { index: index } });
      });
    }
  }, [fieldMapping, showMapping]);

  const reorderRowData = (item: any, headers: string[]) => {
    const row = {};
    headers.map((header) => {
      row[header] = item[header];
    });
    return row;
  };

  return showMapping ? (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>
        🧩 {t("DATATABLE.FIELD_MAPPING_TABLE")}
      </BoxHeading>
      <Stack m={2} direction="row-reverse">
        <Button
          colorScheme="blue"
          onClick={() => setShowMapping(false)}
          leftIcon={<ArrowBackIcon />}
        >
          {t("DATATABLE.UPLOAD_AGAIN")}
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
              {fields.map((data, index) => (
                <Td key={index}>
                  <Select
                    name={`columnsMapping.${index}.fieldKey`}
                    label={t("ACTIONS.FLAG.CATEGORY")}
                    options={OBSERVATION_FIELDS}
                    form={form}
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
  ) : null;
}
