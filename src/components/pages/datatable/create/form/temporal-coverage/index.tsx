import { Box, SimpleGrid } from "@chakra-ui/react";
import { DateRangePickerField } from "@components/form/daterangepicker";
import { SelectInputField } from "@components/form/select";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { DATE_ACCURACY_OPTIONS } from "@components/pages/observation/create/form/options";
import { translateOptions } from "@utils/i18n";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";

export default function TemporalCoverage() {
  const { t } = useTranslation();
  const [isDisable, setIsDisable] = useState<boolean>();
  const translatedDateOptions = useMemo(() => translateOptions(t, DATE_ACCURACY_OPTIONS), []);

  return (
    <ToggleablePanel icon="📅" title={t("datatable:temporal")}>
      <Box p={4} pb={0}>
        <SimpleGrid columns={{ md: 2 }} spacing={{ md: 4 }}>
          <DateRangePickerField
            hasMaxDate={true}
            disableInput={isDisable}
            isRequired={!isDisable}
            name="observedDateRange"
            label={t("form:date_range")}
          />
          <SelectInputField
            name="dateAccuracy"
            label={t("form:date_accuracy")}
            isRequired={true}
            onChangeCallback={(value) =>
              value === "UNKNOWN" ? setIsDisable(true) : setIsDisable(false)
            }
            options={translatedDateOptions}
            shouldPortal={true}
          />
        </SimpleGrid>
      </Box>
    </ToggleablePanel>
  );
}
