import { Box, SimpleGrid } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import DateRangePickerField from "@components/form/daterangepicker";
import SelectInputField from "@components/form/select";
import { DATE_ACCURACY_OPTIONS } from "@components/pages/observation/create/form/options";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function TemporalCoverage({ form }) {
  const { t } = useTranslation();

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>📅 {t("DATATABLE.TEMPORAL")}</BoxHeading>
      <SimpleGrid columns={[1, 1, 2, 2]} spacing={2}>
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
  );
}
