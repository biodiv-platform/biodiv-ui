import { Box, SimpleGrid } from "@chakra-ui/react";
import { DateRangePickerField } from "@components/form/daterangepicker";
import { SelectInputField } from "@components/form/select";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { DATE_ACCURACY_OPTIONS } from "@components/pages/observation/create/form/options";
import useTranslation from "@hooks/use-translation";
import React, { useState } from "react";

export default function TemporalCoverage() {
  const { t } = useTranslation();
  const [isDisable, setIsDisable] = useState<boolean>();

  return (
    <ToggleablePanel icon="📅" title={t("DATATABLE.TEMPORAL")}>
      <Box p={4} pb={0}>
        <SimpleGrid columns={{ md: 2 }} spacing={{ md: 4 }}>
          <DateRangePickerField
            hasMaxDate={false}
            disableInput={isDisable}
            name="observedDateRange"
            label={t("GROUP.RULES.INPUT_TYPES.DATE_RANGE")}
          />
          <SelectInputField
            name="dateAccuracy"
            label={t("OBSERVATION.DATE_ACCURACY")}
            isRequired={true}
            onChangeCallback={(value) =>
              value === "UNKNOWN" ? setIsDisable(true) : setIsDisable(false)
            }
            options={DATE_ACCURACY_OPTIONS}
          />
        </SimpleGrid>
      </Box>
    </ToggleablePanel>
  );
}
