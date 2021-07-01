import { FormControl, FormHelperText, Input, InputGroup, SimpleGrid } from "@chakra-ui/react";
import useSpecies from "@components/pages/species/show/use-species";
import { axUpdateSpeciesTrait } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import { TraitEditFooter } from "../common/edit-footer";

export default function NumericTraitEdit({ traitId, initialValue, onSave, onClose }) {
  const [value, setValue] = useState(initialValue.map((o) => o.value));
  const { t } = useTranslation();

  const {
    species: {
      species: { id: speciesId, taxonConceptId }
    }
  } = useSpecies();

  const handleOnSave = async () => {
    const payload = {
      pageTaxonId: taxonConceptId,
      valuesString: [value]
    };
    const { success } = await axUpdateSpeciesTrait(speciesId, traitId, payload);
    if (success) {
      onSave([{ id: traitId, value }]);
      onClose();
      notification(t("species:traits.update.success"), NotificationType.Success);
    } else {
      notification(t("species:traits.update.failure"));
    }
  };

  return (
    <div>
      <SimpleGrid columns={{ md: 3 }} spacing={4} mb={3}>
        <FormControl id={traitId}>
          <InputGroup maxW="md">
            <Input name={traitId} defaultValue={value} onChange={(e) => setValue(e.target.value)} />
          </InputGroup>
          <FormHelperText>{t("species:traits.range_hint")}</FormHelperText>
        </FormControl>
      </SimpleGrid>
      <TraitEditFooter onSave={handleOnSave} onCancel={onClose} />
    </div>
  );
}
