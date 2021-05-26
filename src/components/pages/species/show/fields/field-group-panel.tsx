import { IconButton } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import useTranslation from "@hooks/use-translation";
import EyeIcon from "@icons/eye";
import EyeSlashIcon from "@icons/eye-slash";
import { SpeciesField } from "@interfaces/custom";
import React, { useState } from "react";
import urlSlug from "url-slug";

import SpeciesFieldGroup from "./field";
import useSpeciesFields from "./use-species-field";

export default function FieldGroupPanel({ parentField, childField }: SpeciesField) {
  const { showHiddenFields, toggleHiddenFields } = useSpeciesFields();
  const { t } = useTranslation();
  const [childFieldsHasValue, setChildFieldsHasValue] = useState<boolean>();

  const PanelOptions = () => (
    <IconButton
      aria-label={t("SPECIES.TOGGLE_EMPTY")}
      title={t("SPECIES.TOGGLE_EMPTY")}
      variant="ghost"
      size="lg"
      onClick={toggleHiddenFields}
      icon={showHiddenFields ? <EyeIcon /> : <EyeSlashIcon />}
    />
  );

  return (
    <ToggleablePanel
      id={urlSlug(parentField.header)}
      icon="📚"
      title={parentField.header}
      options={<PanelOptions />}
    >
      <Box p={4} pb={0}>
        <SpeciesFieldGroup
          key={parentField.id}
          parentField={parentField}
          childField={childField}
          level={0}
          valueCallback={setChildFieldsHasValue}
        />

        {!childFieldsHasValue && !showHiddenFields && <Box mb={4}>{t("NO_DATA")}</Box>}
      </Box>
    </ToggleablePanel>
  );
}
