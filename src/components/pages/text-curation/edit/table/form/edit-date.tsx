import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { DatePickerField } from "@components/form/datepicker";
import { SelectInputField } from "@components/form/select";
import { parseDate } from "@utils/date";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";

import { DATE_FORMAT, DATE_FORMAT_OPTIONS } from "../data";

export default function DateEdit({ row }) {
  const { t } = useTranslation();
  const inputRef = useRef<any>({});
  const hForm = useFormContext();

  const onTagSelect = (type, value) => {
    const parsedDate = parseDate(hForm.getValues("curatedDate"));

    switch (type) {
      case "DAY":
        parsedDate.setDate(Number(value));
        break;
      case "MONTH":
        parsedDate.setMonth(Number(value) - 1);
        break;
      case "YEAR":
        parsedDate.setFullYear(Number(value));
        break;
      default:
        break;
    }

    if (parsedDate > new Date()) {
      notification("Date In Future");
    } else {
      inputRef.current.onChange(parsedDate);
    }
  };

  const dateFormat = hForm.watch("curatedDateFormat");

  return (
    <Box px={4} mb={6}>
      {Object.entries(row.DATE)
        .reverse()
        .map(([type, value]: any) =>
          value.map((v) => (
            <Button
              variant="outline"
              size="xs"
              bg="blue.50"
              key={type + v}
              colorScheme="blue"
              borderRadius="3xl"
              mb={2}
              mr={2}
              onClick={() => onTagSelect(type, v)}
            >
              {type}: {v}
            </Button>
          ))
        )}
      <SimpleGrid columns={2} gap={4} mb={3}>
        <DatePickerField
          name="curatedDate"
          label={t("text-curation:curated.date")}
          disabled={false}
          inputRef={inputRef}
          dateFormat={DATE_FORMAT[dateFormat]}
          mb={0}
        />
        <SelectInputField
          name="curatedDateFormat"
          label={t("form:date_accuracy")}
          options={DATE_FORMAT_OPTIONS}
          mb={0}
        />
      </SimpleGrid>
    </Box>
  );
}
