import { Box } from "@chakra-ui/react";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import GroupSelector from "@components/pages/observation/create/form/groups";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function TaxonomyCovergae({ speciesGroups }) {
  const { t } = useTranslation();

  return (
    <ToggleablePanel icon="🐾" title={t("datatable:taxonomy")}>
      <Box p={4} pb={0}>
        <GroupSelector
          name="sgroup"
          label={t("form:species_groups")}
          options={speciesGroups}
          hideDevider={true}
        />
      </Box>
    </ToggleablePanel>
  );
}
