import { Box } from "@chakra-ui/react";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import GroupSelector from "@components/pages/observation/create/form/groups";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function TaxonomyCovergae({ speciesGroups }) {
  const { t } = useTranslation();

  return (
    <ToggleablePanel icon="🐾" title={t("DATATABLE.TAXONOMY")}>
      <Box p={4} pb={0}>
        <GroupSelector
          name="sgroup"
          label={t("OBSERVATION.GROUPS")}
          options={speciesGroups}
          hideDevider={true}
        />
      </Box>
    </ToggleablePanel>
  );
}
