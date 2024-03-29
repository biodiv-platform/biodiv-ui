import { Box, Divider, SimpleGrid } from "@chakra-ui/react";
import { DatePickerNextField } from "@components/form/datepicker-next";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { axQueryTagsByText } from "@services/observation.service";
import { BASIS_OF_RECORD } from "@static/datatable";
import { translateOptions } from "@utils/i18n";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";

import { DATE_ACCURACY_OPTIONS } from "../../../create/form/options";

const onTagsQuery = async (q) => {
  const { data } = await axQueryTagsByText(q);
  return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
};

export default function DateInputs({ showTags = true, disabled }) {
  const { t } = useTranslation();

  const translatedDateOptions = useMemo(() => translateOptions(t, DATE_ACCURACY_OPTIONS), []);
  const [isDisable, setIsDisable] = useState<boolean>(disabled);

  return (
    <>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={4}>
        <Box>
          <SimpleGrid columns={showTags ? [1, 1, 3, 3] : [1]} spacing={4}>
            <DatePickerNextField
              name="observedOn"
              label={t("common:observed_on")}
              style={{ gridColumn: "1/3" }}
              isRequired={!isDisable}
              disabled={isDisable}
              mb={showTags ? 4 : 0}
            />
            <SelectInputField
              name="dateAccuracy"
              label={t("form:date_accuracy")}
              onChangeCallback={(value) =>
                value === "UNKNOWN" ? setIsDisable(true) : setIsDisable(false)
              }
              options={translatedDateOptions}
              shouldPortal={true}
            />
            <SelectInputField
              name="basisOfRecord"
              label={t("datatable:basis_of_record")}
              options={BASIS_OF_RECORD}
              isRequired={true}
              isControlled={true}
              shouldPortal={true}
            />
          </SimpleGrid>
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
        </Box>

        <RichTextareaField name="notes" label={t("observation:notes")} />
      </SimpleGrid>
      {showTags && <Divider mb={3} />}
    </>
  );
}
