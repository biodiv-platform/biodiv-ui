import { Button } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import AddIcon from "@icons/add";
import { SPECIES_FIELD_UPDATE } from "@static/events";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { emit } from "react-gbus";

interface SpeciesFieldSimpleCreateProps {
  fieldId;
  referencesOnly?;
}

export default function SpeciesFieldSimpleCreate({
  fieldId,
  referencesOnly
}: SpeciesFieldSimpleCreateProps) {
  const { t } = useTranslation();

  const handleOnCreate = () =>
    emit(SPECIES_FIELD_UPDATE, {
      fieldId,
      isEdit: false,
      fieldData: {
        status: "UNDER_CREATION"
      },
      contributor: [],
      references: [],
      license: { id: SITE_CONFIG.LICENSE.DEFAULT },
      referencesOnly
    });

  return (
    <div>
      <Button
        variant="outline"
        size="xs"
        colorScheme="green"
        leftIcon={<AddIcon />}
        onClick={handleOnCreate}
      >
        {t("common:add")}
      </Button>
    </div>
  );
}
