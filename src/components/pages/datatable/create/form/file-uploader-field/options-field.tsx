import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import TextBox from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";

export default function Fields({ form, name, fieldMapping }) {
  const { t } = useTranslation();
  const [tabelHeaders, setTableHeaders] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState<any[]>([]);

  const { fields, append } = useFieldArray({
    control: form.control,
    name
  });

  useEffect(() => {
    if (fieldMapping?.length) {
      setTableHeaders(Object.keys(fieldMapping[1]));
      fieldMapping.map((item) => {
        setFieldValues((prevState) => [...prevState, Object.values(item)]);
      });

      Object.keys(fieldMapping[1]).map((item, index) => {
        append({ columnsMapping: { index: index } });
      });
    }
  }, [fieldMapping]);

  return (
    <>
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
                  <TextBox
                    isRequired={true}
                    name={`columnsMapping.${index}.fieldKey`}
                    label={t("GROUP.CUSTOM_FIELD.VALUE")}
                    form={form}
                  />
                </Td>
              ))}
            </Tr>
            <Tr>
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
            </Tr>
            {fieldValues.map((tableData) => (
              <Tr>
                {tableData.map((data, index) => (
                  <Td key={index}>{data}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box>
        {/* {fields.map((_item, index) => (
          <VStack key={_item.id} mb={4}>
            <TextBox
              isRequired={true}
              name={`columnsMapping.${index}.fieldKey`}
              label={t("GROUP.CUSTOM_FIELD.VALUE")}
              form={form}
            />
            <TextBox
              isRequired={true}
              name={`columnsMapping.${index}.description`}
              label={t("GROUP.CUSTOM_FIELD.VALUE")}
              form={form}
            />
          </VStack>
        ))} */}
      </Box>
    </>
  );
}
