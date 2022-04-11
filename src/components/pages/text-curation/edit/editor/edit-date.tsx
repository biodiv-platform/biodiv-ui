import {
  Button,
  ButtonGroup,
  Divider,
  FormLabel,
  ModalFooter,
  SimpleGrid,
  Tag,
  TagLabel
} from "@chakra-ui/react";
import { DatePickerField } from "@components/form/datepicker";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseDate } from "@utils/date";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { DATE_FORMAT } from "../table/data";
import useCurateEdit from "../use-curate-edit";

const DATE_FORMAT_OPTIONS = Object.keys(DATE_FORMAT).map((df) => ({ label: df, value: df }));

export default function EditDate() {
  const { t } = useTranslation();
  const { rows } = useCurateEdit();
  const inputRef = useRef<any>({});

  const [name, suggestions] = useMemo(() => {
    const _dates = {
      DAY: (rows.editing.row.day || null)?.split(",") || [],
      MONTH: (rows.editing.row.month || null)?.split(",") || [],
      YEAR: (rows.editing.row.year || null)?.split(",") || []
    };

    return [rows.editing.name, Object.entries(_dates).reverse()];
  }, [rows.editing]);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        [name]: Yup.string(),
        curatedDateFormat: Yup.string()
      })
    ),
    defaultValues: {
      [name]: rows.editing.row[name],
      curatedDateFormat: DATE_FORMAT_OPTIONS[0].value
    }
  });

  const onTagSelect = (type, value) => {
    const parsedDate = parseDate(hForm.getValues(name));

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

  const handleOnSubmit = (values) => {
    rows.update({
      ...rows.editing.row,
      ...values
    });
    rows.clearEditing();
  };

  const dateFormat = hForm.watch("curatedDateFormat");

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        {suggestions.length > 0 && (
          <>
            <FormLabel>{t("text-curation:parsed.date")}</FormLabel>
            {suggestions.map(([type, value]) =>
              value.map((v) => (
                <Tag size="lg" key={type + v} variant="subtle" colorScheme="cyan" mr={2} mb={2}>
                  <TagLabel>
                    <Button variant="link" colorScheme="blue" onClick={() => onTagSelect(type, v)}>
                      {type}: {v}
                    </Button>
                  </TagLabel>
                </Tag>
              ))
            )}

            <Divider my={4} />
          </>
        )}

        <SimpleGrid columns={2} gap={4}>
          <DatePickerField
            name={name}
            label={name}
            disabled={false}
            inputRef={inputRef}
            dateFormat={DATE_FORMAT[dateFormat]}
          />
          <SelectInputField
            name="curatedDateFormat"
            label={t("form:date_accuracy")}
            options={DATE_FORMAT_OPTIONS}
          />
        </SimpleGrid>

        <ModalFooter px={0}>
          <ButtonGroup>
            <Button variant="ghost" onClick={rows.clearEditing}>
              {t("common:cancel")}
            </Button>
            <SubmitButton>{t("common:save")}</SubmitButton>
          </ButtonGroup>
        </ModalFooter>
      </form>
    </FormProvider>
  );
}
