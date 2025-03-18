import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import { DatePickerNextField } from "@components/form/datepicker-next";
import { SelectInputField } from "@components/form/select";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { DATE_FORMAT, DATE_FORMAT_OPTIONS } from "../data";

const dateFormatProps = {
  [DATE_FORMAT.MONTH]: { showMonthYearPicker: true },
  [DATE_FORMAT.YEAR]: { showYearPicker: true }
};

export default function DateEdit({ row }) {
  const { t } = useTranslation();
  const hForm = useFormContext();

  const onTagSelect = (type, value) => {
    const parsedDate = new Date(hForm.getValues("curatedDate") || new Date());

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
      hForm.setValue("curatedDate", parsedDate);
    }
  };

  const dateFormat = hForm.watch("curatedDateFormat");
  const inputProps = useMemo(() => dateFormatProps[dateFormat] || {}, [dateFormat]);

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
              colorPalette="blue"
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
        <DatePickerNextField
          name="curatedDate"
          label={t("text-curation:curated.date")}
          disabled={false}
          dateFormat={DATE_FORMAT[dateFormat]}
          mb={0}
          inputProps={inputProps}
        />
        <SelectInputField
          name="curatedDateFormat"
          label={t("form:date_accuracy")}
          options={DATE_FORMAT_OPTIONS}
          mb={0}
          shouldPortal={true}
        />
      </SimpleGrid>
    </Box>
  );
}
