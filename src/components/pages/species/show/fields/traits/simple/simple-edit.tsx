import { Box } from "@chakra-ui/react";
import TraitInput from "@components/pages/observation/common/trait-input";
import MultipleCategorialTrait from "@components/pages/observation/common/trait-input/multiple-categorical";
import useSpecies from "@components/pages/species/show/use-species";
import { axUpdateSpeciesTrait } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import { TraitEditFooter } from "../common/edit-footer";

export default function SimpleTraitEdit({ trait, initialValue, onSave, onClose }) {
  const [value, setValue] = useState(initialValue.map((o) => o.valueId));
  const { t } = useTranslation();

  const {
    species: {
      species: { id: speciesId, taxonConceptId }
    }
  } = useSpecies();

  const handleOnSave = async () => {
    const payload = {
      pageTaxonId: taxonConceptId,
      traitValueList: Array.isArray(value) ? value : [value]
    };

    const { success, data } = await axUpdateSpeciesTrait(speciesId, trait.traitId, payload);
    if (success) {
      onSave(data);
      onClose();
      notification(t("species:traits.update.success"), NotificationType.Success);
    } else {
      notification(t("species:traits.update.failure"));
    }
  };

  const handleOnChange = (newValue) => setValue(newValue);

  return (
    <div>
      <Box mb={3}>
        {trait.traitTypes != "RANGE" && (
          <TraitInput
            name={trait.name}
            type={trait.traitTypes}
            values={trait.options}
            defaultValue={value}
            onUpdate={handleOnChange}
            gridColumns={3}
          />
        )}
        {trait.traitTypes == "RANGE" && (
          <MultipleCategorialTrait
            name={trait.name}
            type={trait.traitTypes}
            values={trait.options}
            defaultValue={value}
            onUpdate={handleOnChange}
            gridColumns={3}
          />
        )}
      </Box>
      <TraitEditFooter onSave={handleOnSave} onCancel={onClose} />
    </div>
  );
}
