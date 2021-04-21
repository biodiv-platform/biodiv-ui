import { Box, Button, Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Select from "@components/form/select";
import useTranslation from "@hooks/use-translation";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { OBSERVATION_FIELDS } from "@static/observation-create";
import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import BoxHeading from "@components/@core/layout/box-heading";

export default function Fields({ form, name, fieldMapping, showMapping, setShowMapping }) {
  const { t } = useTranslation();
  const [tabelHeaders, setTableHeaders] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState<any[]>([]);

  const { fields, append } = useFieldArray({
    control: form.control,
    name
  });

  useEffect(() => {
    if (fieldMapping?.length && showMapping) {
      setTableHeaders(Object.keys(fieldMapping[1]));
      fieldMapping.map((item) => {
        setFieldValues((prevState) => [...prevState, Object.values(item)]);
      });

      Object.keys(fieldMapping[1]).map((item, index) => {
        append({ columnsMapping: { index: index } });
      });
    }
  }, [fieldMapping, showMapping]);

  return showMapping ? (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>🧩 {t("Mapping Field Table")}</BoxHeading>
      <Stack m={2} direction="row-reverse">
        <Button
          colorScheme="blue"
          onClick={() => setShowMapping(false)}
          leftIcon={<ArrowBackIcon />}
        >
          {t("Upload Again")}
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
            {/* <Tr>
              {fields.map((data, index) => (
                <Td key={index}>
                  <TextBox
                    isRequired={true}
                    name={`columnsMapping.${index}.description`}
                    label={t("GROUP.CUSTOM_FIELD.VALUE")}
                    form={form}
                  />
                </Td>
              ))}
            </Tr> */}
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
