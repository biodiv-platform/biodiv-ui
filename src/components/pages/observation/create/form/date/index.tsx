import { Box, Separator, SimpleGrid } from "@chakra-ui/react";
import { DatePickerNextField } from "@components/form/datepicker-next";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import useDidUpdateEffect from "@hooks/use-did-update-effect";
import { axQueryTagsByText } from "@services/observation.service";
import { BASIS_OF_RECORD } from "@static/datatable";
import { FORM_DATEPICKER_CHANGE } from "@static/events";
import { parseDate } from "@utils/date";
import { translateOptions } from "@utils/i18n";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useRef, useState } from "react";
import { useListener } from "react-gbus";
import { useController } from "react-hook-form";

import { DATE_ACCURACY_OPTIONS } from "../options";

const onTagsQuery = async (q) => {
  const { data } = await axQueryTagsByText(q);
  return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
};

export default function DateInputs({ showTags = true, isRequired = true }) {
  const { t } = useTranslation();
  const inputRef = useRef<any>();

  const translatedDateOptions = useMemo(() => translateOptions(t, DATE_ACCURACY_OPTIONS), []);

  const { field } = useController({ name: "observedOn" });
  const [date, setDate] = useState(field.value ? parseDate(field.value) : undefined);

  useDidUpdateEffect(() => {
    field.onChange(date);
  }, [date]);

  useListener(
    (d) => {
      d && setDate(d);
    },
    [`${FORM_DATEPICKER_CHANGE}${"observedOn"}`]
  );

  return (
    <>
      <SimpleGrid columns={[1, 1, 1, 2]} gap={4}>
        <Box>
          <SimpleGrid columns={showTags ? [1, 1, 3, 3] : [1]} gap={4}>
            <DatePickerNextField
              name="observedOn"
              label={t("common:observed_on")}
              style={{ gridColumn: "1/3" }}
              isRequired={isRequired}
              mb={showTags ? 4 : 0}
              inputRef={inputRef}
            />
            <SelectInputField
              name="dateAccuracy"
              label={t("form:date_accuracy")}
              options={translatedDateOptions}
              shouldPortal={true}
            />
          </SimpleGrid>
          <SimpleGrid columns={showTags ? { base: 1, md: 2 } : 1} gap={4}>
            {showTags && (
              <SelectAsyncInputField
                name="tags"
                label={t("form:tags")}
                hint={t("form:tags_hint")}
                multiple={true}
                onQuery={onTagsQuery}
                mb={2}
              />
            )}
            <SelectInputField
              name="basisOfRecords"
              label={t("datatable:basis_of_record")}
              options={BASIS_OF_RECORD}
              isRequired={isRequired}
              shouldPortal={true}
            />
          </SimpleGrid>
        </Box>
        <RichTextareaField name="notes" label={t("observation:notes")} />
      </SimpleGrid>
      {showTags && <Separator mb={3} />}
    </>
  );
}
