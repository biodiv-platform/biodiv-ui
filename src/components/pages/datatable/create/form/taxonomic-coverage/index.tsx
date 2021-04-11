import { Box } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import GroupSelector from "@components/pages/observation/create/form/groups";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function TaxonomyCovergae({ form, speciesGroups }) {
  const { t } = useTranslation();

  return (
    <Box bg="white" border="1px solid var(--gray-300)" borderRadius="md" className="container mt">
      <BoxHeading styles={{ marginBottom: "5" }}>👥 {t("Taxonomic Coverage")}</BoxHeading>
      <GroupSelector
        name="sgroup"
        label={t("OBSERVATION.GROUPS")}
        options={speciesGroups}
        form={form}
      />
    </Box>
  );
}
