import { Button, SimpleGrid } from "@chakra-ui/react";
import useSpecies from "@components/pages/species/show/use-species";
import { axUpdateSpeciesTrait } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useImmer } from "use-immer";

import { TraitEditFooter } from "../common/edit-footer";
import { ColorEditSwatch } from "./color-edit-swatch";

export function TraitColorEdit({ traitId, initialValue, onSave, onClose }) {
  const [value, setValue] = useImmer({ l: initialValue || [] });
  const {
    species: {
      species: { id: speciesId, taxonConceptId }
    }
  } = useSpecies();

  const { t } = useTranslation();

  const onSwatchDelete = (index) => {
    setValue((_draft) => {
      _draft.l.splice(index, 1);
    });
  };

  const addSwatch = () => {
    setValue((_draft) => {
      _draft.l.push({ value: undefined });
    });
  };

  const onSwatchChange = (index, updatedValue) => {
    setValue((_draft) => {
      _draft.l[index].value = updatedValue;
    });
  };

  const handleOnSave = async () => {
    const payload = {
      pageTaxonId: taxonConceptId,
      valuesString: value.l.map((o) => o.value)
    };

    const { success } = await axUpdateSpeciesTrait(speciesId, traitId, payload);

    if (success) {
      onSave(value.l);
      onClose();
      notification(t("species:traits.update.success"), NotificationType.Success);
    } else {
      notification(t("species:traits.update.failure"));
    }
  };

  return (
    <div>
      <SimpleGrid columns={{ md: 3 }} spacing={4} mb={3}>
        {value.l.map((value, index) => (
          <ColorEditSwatch
            key={index}
            index={index}
            color={value.value}
            onDelete={onSwatchDelete}
            onChange={onSwatchChange}
          />
        ))}
        <Button h="3.25rem" alignItems="center" justifyContent="center" onClick={addSwatch}>
          {t("common:add")}
        </Button>
      </SimpleGrid>
      <TraitEditFooter onSave={handleOnSave} onCancel={onClose} />
    </div>
  );
}
