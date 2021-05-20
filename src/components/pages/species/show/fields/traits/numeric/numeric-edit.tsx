import { FormControl, FormHelperText, Input, InputGroup, SimpleGrid } from "@chakra-ui/react";
import useSpecies from "@components/pages/species/show/use-species";
import useTranslation from "@hooks/use-translation";
import { axUpdateSpeciesTrait } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
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
      notification(t("SPECIES.TRAITS.UPDATE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("SPECIES.TRAITS.UPDATE.FAILURE"));
    }
  };

  return (
    <div>
      <SimpleGrid columns={{ md: 3 }} spacing={4} mb={3}>
        <FormControl id={traitId}>
          <InputGroup maxW="md">
            <Input name={traitId} defaultValue={value} onChange={(e) => setValue(e.target.value)} />
          </InputGroup>
          <FormHelperText>{t("SPECIES.TRAITS.RANGE_HINT")}</FormHelperText>
        </FormControl>
      </SimpleGrid>
      <TraitEditFooter onSave={handleOnSave} onCancel={onClose} />
    </div>
  );
}
