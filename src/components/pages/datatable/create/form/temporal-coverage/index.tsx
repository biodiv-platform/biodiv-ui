import { Box, SimpleGrid } from "@chakra-ui/react";
import DateRangePickerField from "@components/form/daterangepicker";
import SelectInputField from "@components/form/select";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { DATE_ACCURACY_OPTIONS } from "@components/pages/observation/create/form/options";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function TemporalCoverage({ form }) {
  const { t } = useTranslation();

  return (
    <ToggleablePanel icon="📅" title={t("DATATABLE.TEMPORAL")}>
      <Box p={4} pb={0}>
        <SimpleGrid columns={{ md: 2 }} spacing={{ md: 4 }}>
          <DateRangePickerField
            hasMaxDate={false}
            isRequired={true}
            form={form}
            name="observedDateRange"
            label={t("GROUP.RULES.INPUT_TYPES.DATE_RANGE")}
          />
          <SelectInputField
            name="dateAccuracy"
            label={t("OBSERVATION.DATE_ACCURACY")}
            isRequired={true}
            options={DATE_ACCURACY_OPTIONS}
            form={form}
          />
        </SimpleGrid>
      </Box>
    </ToggleablePanel>
  );
}
