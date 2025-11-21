import { Box, IconButton, Separator } from "@chakra-ui/react";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import EyeIcon from "@icons/eye";
import EyeSlashIcon from "@icons/eye-slash";
import { SpeciesField } from "@interfaces/custom";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import urlSlug from "url-slug";

import SpeciesFieldGroup from "./field";
import useSpeciesFields from "./use-species-field";

export default function FieldGroupPanel({
  parentField,
  childField,
  observationsMap
}: SpeciesField) {
  const { showHiddenFields, toggleHiddenFields } = useSpeciesFields();
  const { t } = useTranslation();
  const [childFieldsHasValue, setChildFieldsHasValue] = useState<boolean>();

  const PanelOptions = () => (
    <IconButton
      aria-label={t("species:toggle_empty")}
      title={t("species:toggle_empty")}
      variant="ghost"
      size="lg"
      onClick={toggleHiddenFields}
    >
      {showHiddenFields ? <EyeIcon /> : <EyeSlashIcon />}
    </IconButton>
  );

  return (
    <ToggleablePanel
      id={urlSlug(parentField.header)}
      icon="📚"
      title={parentField.header}
      options={<PanelOptions />}
    >
      <Separator />
      <Box p={4} pb={0}>
        <SpeciesFieldGroup
          key={parentField.id}
          parentField={parentField}
          childField={childField}
          level={0}
          valueCallback={setChildFieldsHasValue}
          observationsMap={observationsMap}
        />

        {!childFieldsHasValue && !showHiddenFields && <Box mb={4}>{t("common:no_data")}</Box>}
      </Box>
    </ToggleablePanel>
  );
}
