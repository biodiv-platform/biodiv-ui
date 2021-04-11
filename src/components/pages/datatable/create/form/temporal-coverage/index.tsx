import { Box, SimpleGrid } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import Datepicker from "@components/form/datepicker";
import SelectInputField from "@components/form/select";
import { DATE_ACCURACY_OPTIONS } from "@components/pages/observation/create/form/options";
import useTranslation from "@hooks/use-translation";
import { LICENSES_ARRAY } from "@static/licenses";
import React from "react";

export default function TemporalCoverage({ form }) {
  const { t } = useTranslation();

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>👥 {t("Temporal Covergae & License")}</BoxHeading>
      <SimpleGrid columns={[1, 1, 4, 4]} spacing={2}>
        <Datepicker
          name="observedOn"
          label={t("OBSERVATION.OBSERVED_ON")}
          style={{ gridColumn: "1/3" }}
          form={form}
          isRequired={true}
          subscribe={true}
          mb={0}
        />
        <SelectInputField
          name="dateAccuracy"
          label={t("OBSERVATION.DATE_ACCURACY")}
          options={DATE_ACCURACY_OPTIONS}
          form={form}
        />
        <Box>
          <SelectInputField
            name="licenseId"
            label={t("DOCUMENT.LICENSE")}
            form={form}
            options={LICENSES_ARRAY}
            isRequired={true}
            isControlled={true}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
